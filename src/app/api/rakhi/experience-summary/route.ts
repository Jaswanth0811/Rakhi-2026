import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSisterSession } from "@/lib/security";
import { generateAIExperienceSummary } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSisterSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const sessionId = req.cookies.get("rakhi_session_id")?.value || "default_session";

    // Retrieve sister's answers from this session
    const responses = await db.userResponse.findMany({
      where: {
        sisterId: sessionUser.sisterId,
        sessionId,
      },
      include: {
        question: true,
      },
      orderBy: { answeredAt: "asc" },
    });

    const qaList = responses
      .filter((r) => r.question && r.question.type !== "sister_reply")
      .map((r) => ({
        question: r.question.question,
        answer: r.answer,
      }));

    const aiSummary = await generateAIExperienceSummary(
      sessionUser.sisterName,
      qaList
    );

    return NextResponse.json({
      success: true,
      title: aiSummary.title,
      summaryMessage: aiSummary.summaryMessage,
      answerCount: qaList.length,
    });
  } catch (error) {
    console.error("Experience summary error:", error);
    return NextResponse.json({
      success: true,
      title: "Our Sibling Story So Far ❤️",
      summaryMessage: "Looking at your answers, our bond is full of sweet memories and laughter. Now, I have written something special straight from my heart...",
    });
  }
}
