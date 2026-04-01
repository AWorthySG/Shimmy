import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/*
 * Required Supabase RLS policy — run this SQL in the Supabase dashboard:
 *
 * CREATE POLICY "Anyone can update booking status" ON bookings FOR UPDATE TO anon USING (true) WITH CHECK (true);
 */

/**
 * PATCH /api/bookings/[id]
 *
 * Updates a booking's status (confirm or cancel).
 * Sends a notification email via Resend when configured.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json(
      { error: 'Booking system is not configured yet.' },
      { status: 503 },
    )
  }

  const body = await request.json()
  const { status } = body

  if (!status || !['confirmed', 'cancelled'].includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status. Must be "confirmed" or "cancelled".' },
      { status: 400 },
    )
  }

  // Fetch the existing booking first (for email details)
  const { data: existing, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 },
    )
  }

  // Update status
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Booking update error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 },
    )
  }

  // Send email notification via Resend if configured
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && existing.client_email) {
    try {
      const formattedDate = new Date(existing.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      const [h, m] = existing.time.split(':').map(Number)
      const period = h >= 12 ? 'PM' : 'AM'
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const formattedTime = `${hour12}:${String(m).padStart(2, '0')} ${period}`

      if (status === 'confirmed') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Shimmyhands <hello@shimmyhands.com>',
            to: existing.client_email,
            subject: 'Your booking with Shimmyhands is confirmed \u2713',
            html: `
              <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #2E3328;">
                <h1 style="font-size: 24px; margin-bottom: 16px;">Booking Confirmed &#10003;</h1>
                <p style="line-height: 1.6; color: #666;">Hi ${existing.client_name},</p>
                <p style="line-height: 1.6; color: #666;">Your appointment has been confirmed! Here are the details:</p>
                <div style="margin: 24px 0; padding: 16px; background: #f9f2ee; border-left: 3px solid #536442;">
                  <p style="margin: 0 0 8px; font-size: 14px; color: #2E3328;"><strong>Service:</strong> ${existing.service_name}</p>
                  <p style="margin: 0 0 8px; font-size: 14px; color: #2E3328;"><strong>Date:</strong> ${formattedDate}</p>
                  <p style="margin: 0 0 8px; font-size: 14px; color: #2E3328;"><strong>Time:</strong> ${formattedTime}</p>
                  <p style="margin: 0; font-size: 14px; color: #2E3328;"><strong>Duration:</strong> ${existing.duration_minutes} minutes</p>
                </div>
                <p style="line-height: 1.6; color: #999; font-size: 13px;">Add this to your calendar so you don&rsquo;t forget!</p>
                <p style="margin-top: 24px; font-size: 12px; color: #999;">&mdash; The Shimmyhands Team</p>
              </div>
            `,
          }),
        })
      } else if (status === 'cancelled') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Shimmyhands <hello@shimmyhands.com>',
            to: existing.client_email,
            subject: 'Your Shimmyhands booking has been cancelled',
            html: `
              <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #2E3328;">
                <h1 style="font-size: 24px; margin-bottom: 16px;">Booking Cancelled</h1>
                <p style="line-height: 1.6; color: #666;">Hi ${existing.client_name},</p>
                <p style="line-height: 1.6; color: #666;">Your appointment has been cancelled:</p>
                <div style="margin: 24px 0; padding: 16px; background: #f9f2ee; border-left: 3px solid #c44;">
                  <p style="margin: 0 0 8px; font-size: 14px; color: #2E3328;"><strong>Service:</strong> ${existing.service_name}</p>
                  <p style="margin: 0 0 8px; font-size: 14px; color: #2E3328;"><strong>Date:</strong> ${formattedDate}</p>
                  <p style="margin: 0; font-size: 14px; color: #2E3328;"><strong>Time:</strong> ${formattedTime}</p>
                </div>
                <p style="line-height: 1.6; color: #666;">If this was a mistake, feel free to rebook at <a href="https://shimmyhands.com/nails/book" style="color: #536442;">shimmyhands.com</a> or reach out via WhatsApp.</p>
                <p style="margin-top: 24px; font-size: 12px; color: #999;">&mdash; The Shimmyhands Team</p>
              </div>
            `,
          }),
        })
      }
    } catch {
      // Email send failed — non-critical, booking status already updated
    }
  }

  return NextResponse.json({ booking: data })
}
