import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";

export async function GET() {
  try {
    const themes = await db.theme.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ themes });
  } catch (error) {
    console.error("GET themes error:", error);
    return NextResponse.json({ error: "Failed to fetch themes." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, description, configuration, previewImage } = body;

    if (!name || !configuration) {
      return NextResponse.json({ error: "Theme name and configuration are required." }, { status: 400 });
    }

    const themeId = id || name.toLowerCase().replace(/\s+/g, "_");

    const theme = await db.theme.upsert({
      where: { id: themeId },
      update: { name, description, configuration, previewImage },
      create: { id: themeId, name, description, configuration, previewImage },
    });

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("POST theme error:", error);
    return NextResponse.json({ error: "Failed to save theme." }, { status: 500 });
  }
}
