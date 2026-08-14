import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashCode, createSisterToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string" || code.trim().length !== 6) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit secret code." },
        { status: 400 }
      );
    }

    const hashedInput = hashCode(code.trim());

    // Find sister access record by codeHash
    const access = await db.sisterAccess.findFirst({
      where: { codeHash: hashedInput, isActive: true },
      include: { sister: true },
    });

    if (!access || !access.sister || access.sister.status !== "published") {
      return NextResponse.json(
        { error: "Hmm... That doesn't look like the secret code. Try again. ❤️" },
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

    // In-memory session cookie (no persistent maxAge)
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
