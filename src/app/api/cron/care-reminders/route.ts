import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/**
 * GET /api/cron/care-reminders
 *
 * Vercel cron endpoint. Protected by CRON_SECRET.
 * Checks confirmed bookings at key intervals (1 day, 7 days, 42 days)
 * and logs care_reminder analytics events.
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
    const today = new Date()
    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    // Calculate target dates
    const day1Ago = new Date(today)
    day1Ago.setDate(today.getDate() - 1)

    const week1Ago = new Date(today)
    week1Ago.setDate(today.getDate() - 7)

    const week6Ago = new Date(today)
    week6Ago.setDate(today.getDate() - 42)

    const checkDates: { date: string; type: string }[] = [
      { date: formatDate(day1Ago), type: 'day1_aftercare' },
      { date: formatDate(week1Ago), type: 'week1_checkin' },
      { date: formatDate(week6Ago), type: 'touchup_reminder' },
    ]

    let remindersLogged = 0

    for (const check of checkDates) {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('id, client_name, client_phone, service_name, date')
        .eq('status', 'confirmed')
        .eq('date', check.date)

      if (error) {
        console.error(`Failed to query bookings for ${check.date}:`, error.message)
        continue
      }

      for (const booking of bookings ?? []) {
        await supabase.from('analytics_events').insert({
          event: 'care_reminder',
          page: null,
          metadata: {
            type: check.type,
            client_name: booking.client_name,
            client_phone: booking.client_phone,
            booking_id: booking.id,
          },
          session_id: null,
          created_at: new Date().toISOString(),
        })
        remindersLogged++
      }
    }

    return NextResponse.json({ reminders_logged: remindersLogged })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
