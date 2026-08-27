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
    const { questionId, answer, optionId, photoContext, recentHistory } = body;

    if (!questionId || answer === undefined) {
      return NextResponse.json(
        { error: "Question ID and answer are required." },
        { status: 400 }
      );
    }

    // Save response in database
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

    // Fetch question with all its options for full AI context
    const question = await db.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
      },
    });

    // Determine Response Message:
    // If pre-configured manual responseMessage exists on the option, use it.
    // Otherwise, generate dynamically using AI with full context.
    let responseMessage = optionReaction?.responseMessage;
    let animationType = optionReaction?.animationType || "confetti";

    if (!responseMessage && question) {
      const aiReaction = await generateAIAnswerReaction({
        question: question.question,
        questionType: question.type,
        answer: String(answer),
        options: (question.options || []).map((o) => ({ label: o.label, value: o.value })),
        photoContext: photoContext || (optionReaction?.memory ? optionReaction.memory.caption : null),
        recentHistory: Array.isArray(recentHistory) ? recentHistory.slice(-4) : [],
        sisterName: sessionUser.sisterName,
      });

      responseMessage = aiReaction.responseMessage;
      animationType = aiReaction.animationType;
    }

    return NextResponse.json({
      success: true,
      responseId: savedResponse.id,
      reaction: {
        responseMessage: responseMessage || `Love your answer, ${sessionUser.sisterName}! ❤️`,
        animationType: animationType || "confetti",
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
