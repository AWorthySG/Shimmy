import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HANDLE_RE = /^[a-z0-9-]{1,100}$/

/**
 * POST /api/notify-restock — { email, product_handle }
 * Saves an email to be told when a product is back in stock.
 * Requires the restock_notifications table (see supabase-schema.sql).
 * A repeat sign-up for the same email and product is accepted and stored once.
 */
export async function POST(request: NextRequest) {
  let body: { email?: unknown; product_handle?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const productHandle = typeof body.product_handle === 'string' ? body.product_handle : ''

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (!HANDLE_RE.test(productHandle)) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    console.error('notify-restock: Supabase is not configured')
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const { error } = await supabase
    .from('restock_notifications')
    .upsert(
      { email, product_handle: productHandle },
      { onConflict: 'email,product_handle', ignoreDuplicates: true },
    )

  if (error) {
    console.error('notify-restock: insert failed:', error.message)
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
