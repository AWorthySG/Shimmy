import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { toEventRow } from '@/lib/analytics-events'

/**
 * POST /api/analytics/track
 *
 * Public. Tracks an analytics event.
 * Body: { event, page?, metadata?, session_id? }
 */
export async function POST(request: NextRequest) {
  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ ok: true })
  }

  try {
    const row = toEventRow(await request.json())
    if (!row) {
      return NextResponse.json({ error: 'Unknown event' }, { status: 400 })
    }

    await supabase.from('analytics_events').insert({
      ...row,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Fire-and-forget: don't fail on tracking errors
    return NextResponse.json({ ok: true })
  }
}
