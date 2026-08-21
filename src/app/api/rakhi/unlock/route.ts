import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashCode, createSisterToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    const trimmedCode = code ? String(code).trim() : "";

    if (!trimmedCode || trimmedCode.length < 4 || trimmedCode.length > 6) {
      return NextResponse.json(
        { error: "Please enter your 4-digit DDMM birthday passcode." },
        { status: 400 }
      );
    }

    const hashedInput = hashCode(trimmedCode);

    // Find sister access record by codeHash (exact match)
    let access = await db.sisterAccess.findFirst({
      where: { codeHash: hashedInput, isActive: true },
      include: { sister: true },
    });

    // Backwards compatibility fallback for 4-digit DDMM code matching legacy 6-digit (e.g. "2808" -> "280826")
    if (!access && trimmedCode.length === 4) {
      const legacy6Hash = hashCode(`${trimmedCode}26`);
      access = await db.sisterAccess.findFirst({
        where: { codeHash: legacy6Hash, isActive: true },
        include: { sister: true },
      });
    }

    if (!access || !access.sister || access.sister.status !== "published") {
      return NextResponse.json(
        { error: "Hmm... That passcode doesn't match. Enter your Birthday in DDMM order (e.g. 2808). ❤️" },
        { status: 401 }
      );
    }

    // Update last used timestamp and reset failed attempts
    await db.sisterAccess.update({
      where: { id: access.id },
      data: {
        lastUsedAt: new Date(),
        failedAttempts: 0,
      },
    });

    // Create session record
    const session = await db.experienceSession.create({
      data: {
        sisterId: access.sisterId,
      },
    });

    // Create JWT token
    const token = createSisterToken(access.sisterId, access.sister.name);

    const response = NextResponse.json({
      success: true,
      sisterName: access.sister.name,
      sessionId: session.id,
    });

    response.cookies.set({
      name: "rakhi_sister_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set({
      name: "rakhi_session_id",
      value: session.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Unlock API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Your surprise is still safe. ❤️" },
      { status: 500 }
    );
  }
}
