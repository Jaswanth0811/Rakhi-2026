import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, hashCode } from "@/lib/security";

function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { sisterId } = body;

    if (!sisterId) {
      return NextResponse.json({ error: "Sister ID is required." }, { status: 400 });
    }

    const newCode = generate6DigitCode();
    const codeHash = hashCode(newCode);

    await db.sisterAccess.upsert({
      where: { sisterId },
      update: {
        codeHash,
        failedAttempts: 0,
        isActive: true,
      },
      create: {
        sisterId,
        codeHash,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      newCode,
    });
  } catch (error) {
    console.error("Regenerate Code API Error:", error);
    return NextResponse.json({ error: "Failed to regenerate code." }, { status: 500 });
  }
}
