import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";

export async function GET() {
  try {
    const songs = await db.song.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ songs });
  } catch (error) {
    console.error("GET songs error:", error);
    return NextResponse.json({ error: "Failed to fetch songs." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { title, artist, mood, genre, language, energy, duration, audioUrl, coverUrl } = body;

    if (!title || !artist || !audioUrl) {
      return NextResponse.json({ error: "Title, artist, and audio URL are required." }, { status: 400 });
    }

    const song = await db.song.create({
      data: {
        title,
        artist,
        mood: mood || "Emotional",
        genre: genre || "Acoustic",
        language: language || "Hindi/English",
        energy: energy || "Medium",
        duration: duration || "3:00",
        audioUrl,
        coverUrl: coverUrl || null,
      },
    });

    return NextResponse.json({ success: true, song });
  } catch (error) {
    console.error("POST song error:", error);
    return NextResponse.json({ error: "Failed to create song." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Song ID required." }, { status: 400 });
    }

    await db.song.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Song deleted." });
  } catch (error) {
    console.error("DELETE song error:", error);
    return NextResponse.json({ error: "Failed to delete song." }, { status: 500 });
  }
}
