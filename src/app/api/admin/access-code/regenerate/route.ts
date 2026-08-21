import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { sisterId, customCode } = body;

    if (!sisterId) {
      return NextResponse.json({ error: "Sister ID is required." }, { status: 400 });
    }

    const newCode = customCode && customCode.trim().length >= 4 ? customCode.trim() : "2808";

    await db.sisterAccess.upsert({
      where: { sisterId },
      update: {
        codeHash: newCode, // Plain text DDMM passcode
        failedAttempts: 0,
        isActive: true,
      },
      create: {
        sisterId,
        codeHash: newCode,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      newCode,
    });
  } catch (error) {
    console.error("Regenerate Code API Error:", error);
    return NextResponse.json({ error: "Failed to update access code." }, { status: 500 });
  }
}
