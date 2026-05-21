import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

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
    const body = await request.json()
    const { event, page, metadata, session_id } = body

    if (!event) {
      return NextResponse.json({ error: 'event is required' }, { status: 400 })
    }

    await supabase.from('analytics_events').insert({
      event,
      page: page ?? null,
      metadata: metadata ?? null,
      session_id: session_id ?? null,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Fire-and-forget: don't fail on tracking errors
    return NextResponse.json({ ok: true })
  }
}
