import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { buildReviewEmail, isSafeReviewUrl, reviewRequestDate } from '@/lib/review-request'

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

    // Google review request, 14 days after the appointment, by email.
    // Runs only when both RESEND_API_KEY and GOOGLE_REVIEW_URL are set.
    let reviewRequestsSent = 0
    const resendKey = process.env.RESEND_API_KEY
    const reviewUrl = process.env.GOOGLE_REVIEW_URL
    if (resendKey && isSafeReviewUrl(reviewUrl)) {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('id, client_name, client_email, service_name')
        .eq('status', 'confirmed')
        .eq('date', reviewRequestDate(today))
        .not('client_email', 'is', null)

      if (error) console.error('Failed to query bookings for review requests:', error.message)

      for (const booking of bookings ?? []) {
        const email = buildReviewEmail({ name: booking.client_name, service: booking.service_name, reviewUrl })
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
            // A retried cron run on the same day won't email the client twice.
            'Idempotency-Key': `review-request-${booking.id}`,
          },
          body: JSON.stringify({
            from: 'Shimmyhands <hello@shimmyhands.com>',
            to: booking.client_email,
            subject: email.subject,
            html: email.html,
            text: email.text,
          }),
        }).catch(() => null)
        if (res?.ok) reviewRequestsSent++
        else console.error('Review request email failed for booking', booking.id)
      }
    }

    return NextResponse.json({ reminders_logged: remindersLogged, review_requests_sent: reviewRequestsSent })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
