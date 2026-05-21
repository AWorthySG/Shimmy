import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

/**
 * GET /api/analytics?period=7d|30d|90d
 *
 * Admin-only. Returns aggregated analytics stats.
 */
export async function GET(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  const period = request.nextUrl.searchParams.get('period') ?? '7d'
  const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }
  const days = daysMap[period] ?? 7

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceISO = since.toISOString()

  try {
    // Fetch all events in the period
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('event, page, created_at')
      .gte('created_at', sinceISO)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Analytics fetch error:', error.message)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    const allEvents = events ?? []

    // Summary counts
    const pageViews = allEvents.filter((e) => e.event === 'page_view').length
    const tryOnCompletions = allEvents.filter((e) => e.event === 'tryon_complete').length
    const cartAdds = allEvents.filter((e) => e.event === 'cart_add').length
    const leadsSaved = allEvents.filter((e) => e.event === 'lead_saved').length

    // Top pages
    const pageCounts: Record<string, number> = {}
    for (const e of allEvents) {
      if (e.page) {
        pageCounts[e.page] = (pageCounts[e.page] || 0) + 1
      }
    }
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))

    // Top events
    const eventCounts: Record<string, number> = {}
    for (const e of allEvents) {
      eventCounts[e.event] = (eventCounts[e.event] || 0) + 1
    }
    const topEvents = Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([event, count]) => ({ event, count }))

    // Daily counts
    const dailyCounts: Record<string, number> = {}
    for (const e of allEvents) {
      const day = e.created_at?.split('T')[0] ?? 'unknown'
      dailyCounts[day] = (dailyCounts[day] || 0) + 1
    }
    const daily = Object.entries(dailyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))

    return NextResponse.json({
      period,
      summary: { pageViews, tryOnCompletions, cartAdds, leadsSaved },
      topPages,
      topEvents,
      daily,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
