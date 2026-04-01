import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/**
 * POST /api/subscribe
 * Email list subscription (newsletter / $10 off capture).
 * Stores email in Supabase and optionally sends welcome email via Resend.
 */
export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    console.log('Email subscription:', email)
    return NextResponse.json({ success: true })
  }

  // Store subscriber
  const { error } = await supabase
    .from('subscribers')
    .upsert({ email }, { onConflict: 'email' })

  if (error) {
    console.log('Subscription (table missing?):', email, error.message)
  }

  // Send welcome email via Resend if configured
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Shimmyhands <hello@shimmyhands.com>',
          to: email,
          subject: 'Welcome to Shimmyhands — here\'s your $10 off!',
          html: `
            <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #2E3328;">
              <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to Shimmyhands ✦</h1>
              <p style="line-height: 1.6; color: #666;">Thank you for joining! As promised, here's your <strong>$10 off</strong> your first order.</p>
              <p style="line-height: 1.6; color: #666;">Use code <strong style="color: #536442;">WELCOME10</strong> when you message us on WhatsApp to redeem.</p>
              <div style="margin: 24px 0; padding: 16px; background: #f9f2ee; border-left: 3px solid #536442;">
                <p style="margin: 0; font-size: 14px; color: #536442;"><strong>WELCOME10</strong></p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #999;">$10 off your first purchase</p>
              </div>
              <p style="line-height: 1.6; color: #666;">Browse our latest collections at <a href="https://shimmyhands.com/nails/shop" style="color: #536442;">shimmyhands.com</a></p>
              <p style="margin-top: 24px; font-size: 12px; color: #999;">— The Shimmyhands Team</p>
            </div>
          `,
        }),
      })
    } catch {
      // Email send failed — non-critical
    }
  }

  return NextResponse.json({ success: true })
}
