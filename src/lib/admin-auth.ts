import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'shimmy2024'

/**
 * Checks the request for a valid admin secret via:
 * - Authorization: Bearer <secret>
 * - x-admin-key: <secret>
 *
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization')
  const adminKey = request.headers.get('x-admin-key')

  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (bearerToken === ADMIN_SECRET || adminKey === ADMIN_SECRET) {
    return null
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
