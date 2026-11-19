import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, checkPassword, verifySessionToken } from './admin-session'

/**
 * Checks the request for admin access via either:
 * - the httpOnly session cookie set by POST /api/admin/login, or
 * - Authorization: Bearer <ADMIN_SECRET> (for scripts and scheduled jobs).
 *
 * There is no default password: if ADMIN_SECRET is not set, every request is refused.
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET

  if (verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value, secret)) {
    return null
  }

  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  if (checkPassword(bearerToken, secret)) {
    return null
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
