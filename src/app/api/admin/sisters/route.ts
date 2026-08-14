import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, hashCode } from "@/lib/security";

function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const sisters = await db.sister.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        access: {
          select: { isActive: true, lastUsedAt: true, failedAttempts: true },
        },
        questions: { select: { id: true } },
        responses: { select: { id: true } },
        sessions: { select: { id: true, completedAt: true } },
      },
    });

    const result = sisters.map((sister) => ({
      id: sister.id,
      name: sister.name,
      photoUrl: sister.photoUrl,
      finalMessage: sister.finalMessage,
      themeId: sister.themeId,
      songId: sister.songId,
      motionStyle: sister.motionStyle,
      status: sister.status,
      createdAt: sister.createdAt,
      updatedAt: sister.updatedAt,
      publishedAt: sister.publishedAt,
      questionCount: sister.questions.length,
      responseCount: sister.responses.length,
      completedCount: sister.sessions.filter((s) => s.completedAt !== null).length,
      accessActive: sister.access?.isActive ?? false,
      lastAccessAt: sister.access?.lastUsedAt ?? null,
    }));

    return NextResponse.json({ sisters: result });
  } catch (error) {
    console.error("Admin GET sisters error:", error);
    return NextResponse.json({ error: "Failed to fetch sisters." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { name, photoUrl, finalMessage, themeId, songId, motionStyle, customCode } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Sister name is required." }, { status: 400 });
    }

    const secretCode = customCode && customCode.trim().length === 6 ? customCode.trim() : generateRandomCode();
    const codeHash = hashCode(secretCode);

    const sister = await db.sister.create({
      data: {
        name: name.trim(),
        photoUrl: photoUrl || null,
        finalMessage: finalMessage || `Dear ${name.trim()},\n\nHappy Raksha Bandhan! ❤️`,
        themeId: themeId || "warm_sunset",
        songId: songId || null,
        motionStyle: motionStyle || "cinematic",
        status: "draft",
        access: {
          create: {
            codeHash,
            isActive: true,
          },
        },
      },
      include: {
        access: true,
      },
    });

    return NextResponse.json({
      success: true,
      sister,
      generatedCode: secretCode, // Only returned ONCE during creation for Admin to copy
    });
  } catch (error) {
    console.error("Admin POST sister error:", error);
    return NextResponse.json({ error: "Failed to create sister." }, { status: 500 });
  }
}
