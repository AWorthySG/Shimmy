import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/**
 * GET /api/cron/abandoned-carts
 *
 * Vercel cron endpoint. Protected by CRON_SECRET.
 * Finds carts abandoned 24-48h ago and logs analytics events.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const now = new Date()
    const h24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    const h48Ago = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()

    const { data: carts, error } = await supabase
      .from('cart_sessions')
      .select('session_id, items, updated_at')
      .lt('updated_at', h24Ago)
      .gte('updated_at', h48Ago)

    if (error) {
      console.error('Failed to query abandoned carts:', error.message)
      return NextResponse.json({ error: 'Query failed' }, { status: 500 })
    }

    let processed = 0

    for (const cart of carts ?? []) {
      // Skip empty carts
      const items = cart.items
      if (!items || (Array.isArray(items) && items.length === 0)) continue

      // Skip Telegram carts
      if (typeof cart.session_id === 'string' && cart.session_id.startsWith('tg:')) continue

      const itemCount = Array.isArray(items) ? items.length : 0

      // Log abandoned cart analytics event
      await supabase.from('analytics_events').insert({
        event: 'cart_abandoned',
        page: null,
        metadata: { session_id: cart.session_id, item_count: itemCount },
        session_id: cart.session_id,
        created_at: new Date().toISOString(),
      })

      processed++
    }

    return NextResponse.json({ processed })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
