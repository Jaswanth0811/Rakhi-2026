import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSisterSession } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSisterSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const sessionId = req.cookies.get("rakhi_session_id")?.value;

    if (sessionId) {
      await db.experienceSession.updateMany({
        where: { id: sessionId },
        data: {
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complete API error:", error);
    return NextResponse.json(
      { error: "Failed to mark completion." },
      { status: 500 }
    );
  }
}
