import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Session reset." });
  response.cookies.delete("rakhi_sister_token");
  response.cookies.delete("rakhi_session_id");
  return response;
}
