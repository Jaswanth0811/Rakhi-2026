import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "rakhi-2026-super-secret-jwt-key-for-admin-session-987654321";
const ADMIN_PIN = process.env.ADMIN_PIN || "233014";

/**
 * Hash secret code or PIN securely using SHA-256 with salt
 */
export function hashCode(code: string): string {
  const cleanCode = code.trim().toLowerCase();
  return crypto.createHmac("sha256", JWT_SECRET).update(cleanCode).digest("hex");
}

/**
 * Verify secret code
 */
export function verifyCode(code: string, hashedCode: string): boolean {
  return hashCode(code) === hashedCode;
}

/**
 * Verify Admin PIN (default 233014 or env variable)
 */
export function verifyAdminPin(pin: string): boolean {
  return pin.trim() === ADMIN_PIN.trim();
}

/**
 * Create Admin Session Token
 */
export function createAdminToken(): string {
  return jwt.sign({ role: "admin", authenticatedAt: Date.now() }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify Admin Session Token
 */
export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
    return decoded && decoded.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Create Sister Session Token
 */
export function createSisterToken(sisterId: string, sisterName: string): string {
  return jwt.sign({ sisterId, sisterName, role: "sister" }, JWT_SECRET, {
    expiresIn: "24h",
  });
}

/**
 * Verify Sister Session Token
 */
export function verifySisterToken(token: string): { sisterId: string; sisterName: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sisterId: string; sisterName: string; role?: string };
    if (decoded && decoded.role === "sister") {
      return { sisterId: decoded.sisterId, sisterName: decoded.sisterName };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Helper to get current admin auth from cookies (Server side)
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("rakhi_admin_token")?.value;
  if (!token) return null;
  const isValid = verifyAdminToken(token);
  return isValid ? { isAdmin: true } : null;
}

/**
 * Helper to get active sister session from cookies
 */
export async function getSisterSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("rakhi_sister_token")?.value;
  if (!token) return null;
  return verifySisterToken(token);
}
