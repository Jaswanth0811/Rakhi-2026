import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const totalSisters = await db.sister.count();
    const publishedSisters = await db.sister.count({ where: { status: "published" } });
    const draftSisters = await db.sister.count({ where: { status: "draft" } });
    const totalQuestions = await db.question.count();
    const totalResponses = await db.userResponse.count();
    const totalSessions = await db.experienceSession.count();
    const completedSessions = await db.experienceSession.count({
      where: { completedAt: { not: null } },
    });

    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return NextResponse.json({
      totalSisters,
      publishedSisters,
      draftSisters,
      totalQuestions,
      totalResponses,
      totalSessions,
      completedSessions,
      completionRate,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics." }, { status: 500 });
  }
}
