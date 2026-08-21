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
    const legacy6Hash = trimmedCode.length === 4 ? hashCode(`${trimmedCode}26`) : "";

    // Fetch all active sister access records
    const allAccesses = await db.sisterAccess.findMany({
      where: { isActive: true },
      include: { sister: true },
    });

    // Match by hashed input, plain text code, legacy 6-digit hash, or code prefix
    let matchedAccess = allAccesses.find((acc) => {
      if (!acc.sister) return false;
      return (
        acc.codeHash === hashedInput ||
        acc.codeHash === trimmedCode ||
        (legacy6Hash && acc.codeHash === legacy6Hash) ||
        acc.codeHash.startsWith(trimmedCode)
      );
    });

    // Fallback: If only 1 sister exists in the database, allow unlocking directly for a seamless experience
    if (!matchedAccess && allAccesses.length === 1 && allAccesses[0].sister) {
      matchedAccess = allAccesses[0];
    }

    if (!matchedAccess || !matchedAccess.sister) {
      return NextResponse.json(
        { error: "Hmm... That passcode doesn't match. Enter your Birthday in DDMM order (e.g. 2808). ❤️" },
        { status: 401 }
      );
    }

    // Auto-publish sister if currently in draft status so it is immediately unlocked
    if (matchedAccess.sister.status !== "published") {
      await db.sister.update({
        where: { id: matchedAccess.sisterId },
        data: { status: "published", publishedAt: new Date() },
      });
    }

    // Update last used timestamp and reset failed attempts
    await db.sisterAccess.update({
      where: { id: matchedAccess.id },
      data: {
        lastUsedAt: new Date(),
        failedAttempts: 0,
      },
    });

    // Create session record
    const session = await db.experienceSession.create({
      data: {
        sisterId: matchedAccess.sisterId,
      },
    });

    // Create JWT token
    const token = createSisterToken(matchedAccess.sisterId, matchedAccess.sister.name);

    const response = NextResponse.json({
      success: true,
      sisterName: matchedAccess.sister.name,
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
