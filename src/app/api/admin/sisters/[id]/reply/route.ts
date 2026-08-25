import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const sister = await db.sister.findUnique({
      where: { id },
      select: { id: true, name: true, photoUrl: true },
    });

    if (!sister) {
      return NextResponse.json({ error: "Sister not found." }, { status: 404 });
    }

    // Find sister reply response
    const replyResponse = await db.userResponse.findFirst({
      where: {
        sisterId: id,
        question: {
          type: "sister_reply",
        },
      },
      orderBy: { answeredAt: "desc" },
    });

    return NextResponse.json({
      sister,
      reply: replyResponse
        ? {
            id: replyResponse.id,
            message: replyResponse.answer,
            answeredAt: replyResponse.answeredAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Admin GET sister reply error:", error);
    return NextResponse.json({ error: "Failed to fetch sister reply." }, { status: 500 });
  }
}
