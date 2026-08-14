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
      include: {
        access: true,
        questions: {
          orderBy: { displayOrder: "asc" },
          include: {
            options: {
              include: { memory: true },
            },
          },
        },
        memories: true,
        aiRecommendations: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { responses: true, sessions: true },
        },
      },
    });

    if (!sister) {
      return NextResponse.json({ error: "Sister not found." }, { status: 404 });
    }

    return NextResponse.json({ sister });
  } catch (error) {
    console.error("Admin GET sister by ID error:", error);
    return NextResponse.json({ error: "Failed to fetch sister." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, photoUrl, finalMessage, themeId, songId, motionStyle, status } = body;

    const updated = await db.sister.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(finalMessage !== undefined && { finalMessage }),
        ...(themeId !== undefined && { themeId }),
        ...(songId !== undefined && { songId }),
        ...(motionStyle !== undefined && { motionStyle }),
        ...(status && {
          status,
          publishedAt: status === "published" ? new Date() : undefined,
        }),
      },
      include: {
        access: true,
        questions: true,
      },
    });

    return NextResponse.json({ success: true, sister: updated });
  } catch (error) {
    console.error("Admin PUT sister error:", error);
    return NextResponse.json({ error: "Failed to update sister." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    await db.sister.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Sister deleted." });
  } catch (error) {
    console.error("Admin DELETE sister error:", error);
    return NextResponse.json({ error: "Failed to delete sister." }, { status: 500 });
  }
}
