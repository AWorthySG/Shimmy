import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  SESSION_TTL_MS,
  checkPassword,
  createSessionToken,
  verifySessionToken,
} from '@/lib/admin-session'

/*
 * Slows password guessing: 5 failed attempts per 15 minutes per IP.
 * The limit is per server instance; add a Vercel Firewall rule for a hard limit.
 */
const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 5
const failures = new Map<string, number[]>()

function recentFailures(ip: string): number[] {
  const now = Date.now()
  const recent = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  failures.set(ip, recent)
  if (failures.size > 5000) failures.clear()
  return recent
}

function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

/** GET /api/admin/login — reports whether the current browser has a valid admin session. */
export async function GET(request: NextRequest) {
  const authed = verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value, process.env.ADMIN_SECRET)
  return NextResponse.json({ authed })
}

/** POST /api/admin/login — { password } → sets an httpOnly session cookie. */
export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set ADMIN_SECRET in Vercel.' },
      { status: 503 },
    )
  }

  const ip = clientIp(request)
  const recent = recentFailures(ip)
  if (recent.length >= MAX_FAILURES) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 })
  }

  let password: unknown
  try {
    password = (await request.json())?.password
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!checkPassword(password, secret)) {
    recent.push(Date.now())
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  failures.delete(ip)
  const res = NextResponse.json({ authed: true })
  res.cookies.set(ADMIN_COOKIE, createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
  return res
}

/** DELETE /api/admin/login — signs out. */
export async function DELETE() {
  const res = NextResponse.json({ authed: false })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
