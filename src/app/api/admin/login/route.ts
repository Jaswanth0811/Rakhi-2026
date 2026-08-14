import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPin, createAdminToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ error: "Please enter the Admin PIN." }, { status: 400 });
    }

    if (!verifyAdminPin(pin)) {
      return NextResponse.json({ error: "Invalid Admin PIN. Access denied." }, { status: 401 });
    }

    const token = createAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
    });

    response.cookies.set({
      name: "rakhi_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
