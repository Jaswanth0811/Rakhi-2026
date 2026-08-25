import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSisterSession } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSisterSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const sessionId = req.cookies.get("rakhi_session_id")?.value || "default_session";
    const body = await req.json();
    const { message } = body;

    const trimmedMessage = message ? String(message).trim() : "";

    if (!trimmedMessage) {
      return NextResponse.json({ success: true, skipped: true });
    }

    // Ensure dummy question record exists for "sister_reply" so foreign key constraint passes
    let dummyQuestion = await db.question.findFirst({
      where: { sisterId: sessionUser.sisterId, type: "sister_reply" },
    });

    if (!dummyQuestion) {
      dummyQuestion = await db.question.create({
        data: {
          sisterId: sessionUser.sisterId,
          question: "Sister Heartfelt Message / Reply to Brother",
          type: "sister_reply",
          displayOrder: 999,
        },
      });
    }

    // Save response
    const savedResponse = await db.userResponse.create({
      data: {
        sisterId: sessionUser.sisterId,
        questionId: dummyQuestion.id,
        answer: trimmedMessage,
        sessionId,
      },
    });

    return NextResponse.json({
      success: true,
      responseId: savedResponse.id,
    });
  } catch (error) {
    console.error("Save sister reply error:", error);
    return NextResponse.json({ error: "Failed to save reply." }, { status: 500 });
  }
}
