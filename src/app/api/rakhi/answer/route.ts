import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSisterSession } from "@/lib/security";
import { generateAIAnswerReaction } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSisterSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const sessionId = req.cookies.get("rakhi_session_id")?.value || "default_session";
    const body = await req.json();
    const { questionId, answer, optionId } = body;

    if (!questionId || answer === undefined) {
      return NextResponse.json(
        { error: "Question ID and answer are required." },
        { status: 400 }
      );
    }

    // Save response
    const savedResponse = await db.userResponse.create({
      data: {
        sisterId: sessionUser.sisterId,
        questionId,
        answer: String(answer),
        sessionId,
      },
    });

    // Update experience session current progress
    await db.experienceSession.updateMany({
      where: { id: sessionId },
      data: {
        currentQuestionId: questionId,
        lastActivityAt: new Date(),
      },
    });

    // Find custom option reaction or memory if optionId provided
    let optionReaction = null;
    if (optionId && optionId !== "text_input" && optionId !== "rating_input") {
      optionReaction = await db.answerOption.findUnique({
        where: { id: optionId },
        include: { memory: true },
      });
    }

    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    // Generate AI reaction dynamically based on the sister's answer
    let responseMessage = optionReaction?.responseMessage;
    let animationType = optionReaction?.animationType || "confetti";

    if (!responseMessage && question) {
      const aiReaction = await generateAIAnswerReaction(
        question.question,
        String(answer),
        sessionUser.sisterName
      );
      responseMessage = aiReaction.responseMessage;
      animationType = aiReaction.animationType;
    }

    return NextResponse.json({
      success: true,
      responseId: savedResponse.id,
      reaction: {
        responseMessage: responseMessage || `Love your answer, ${sessionUser.sisterName}! ❤️`,
        animationType,
        nextQuestionId: optionReaction?.nextQuestionId || null,
        memory: optionReaction?.memory || null,
      },
    });
  } catch (error) {
    console.error("Answer API error:", error);
    return NextResponse.json(
      { error: "Failed to save answer." },
      { status: 500 }
    );
  }
}
