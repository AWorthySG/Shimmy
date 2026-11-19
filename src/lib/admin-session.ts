import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Admin session tokens for the single-owner admin page.
 *
 * Token format: `<expiryMs>.<hex HMAC-SHA256 of expiry>`, keyed by ADMIN_SECRET.
 * Changing ADMIN_SECRET signs every existing session out.
 */

export const ADMIN_COOKIE = "shimmy_admin";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function sign(payload: string, secret: string): string {
  return createHmac("sha256", `admin-session:${secret}`).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Constant-time password check. An empty or missing secret never matches. */
export function checkPassword(input: unknown, secret: string | undefined): boolean {
  if (!secret || typeof input !== "string" || input.length === 0) return false;
  // Hash both sides so the comparison length does not depend on the input.
  const h = (s: string) => createHmac("sha256", "admin-password").update(s).digest("hex");
  return safeEqual(h(input), h(secret));
}

export function createSessionToken(secret: string, now: number = Date.now()): string {
  const expiry = String(now + SESSION_TTL_MS);
  return `${expiry}.${sign(expiry, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expiry = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!/^\d+$/.test(expiry) || Number(expiry) <= now) return false;
  return safeEqual(mac, sign(expiry, secret));
}
