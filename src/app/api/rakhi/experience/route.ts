import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSisterSession } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSisterSession();

    if (!sessionUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please enter your secret code." },
        { status: 401 }
      );
    }

    const sister = await db.sister.findUnique({
      where: { id: sessionUser.sisterId },
      include: {
        questions: {
          orderBy: { displayOrder: "asc" },
          include: {
            options: {
              include: {
                memory: true,
              },
            },
          },
        },
        memories: true,
      },
    });

    if (!sister || sister.status !== "published") {
      return NextResponse.json(
        { error: "Experience not found or unpublished." },
        { status: 404 }
      );
    }

    // Fetch theme
    let themeConfig: any = null;
    if (sister.themeId) {
      const theme = await db.theme.findUnique({
        where: { id: sister.themeId },
      });
      if (theme) {
        if (typeof theme.configuration === "string") {
          try {
            themeConfig = JSON.parse(theme.configuration);
          } catch {
            themeConfig = null;
          }
        } else {
          themeConfig = theme.configuration;
        }
      }
    }

    // Fetch song
    let songData = null;
    if (sister.songId) {
      songData = await db.song.findUnique({
        where: { id: sister.songId },
      });
    }

    return NextResponse.json({
      sister: {
        id: sister.id,
        name: sister.name,
        photoUrl: sister.photoUrl,
        finalMessage: sister.finalMessage,
        motionStyle: sister.motionStyle,
      },
      questions: sister.questions,
      memories: sister.memories,
      theme: themeConfig,
      song: songData,
    });
  } catch (error) {
    console.error("Experience API error:", error);
    return NextResponse.json(
      { error: "Failed to load experience." },
      { status: 500 }
    );
  }
}
