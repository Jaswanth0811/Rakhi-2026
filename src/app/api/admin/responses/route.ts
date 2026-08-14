import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sisterId = searchParams.get("sisterId");

    const responses = await db.userResponse.findMany({
      where: sisterId ? { sisterId } : undefined,
      orderBy: { answeredAt: "desc" },
      include: {
        sister: { select: { name: true, photoUrl: true } },
        question: { select: { question: true, type: true } },
      },
    });

    return NextResponse.json({ responses });
  } catch (error) {
    console.error("Admin GET responses error:", error);
    return NextResponse.json({ error: "Failed to fetch responses." }, { status: 500 });
  }
}
