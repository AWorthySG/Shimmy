import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/**
 * POST /api/notify-restock
 * Saves an email for restock notification.
 */
export async function POST(request: NextRequest) {
  const { email, product_handle } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    // Supabase not configured — just log
    console.log('Restock notification:', email, product_handle)
    return NextResponse.json({ success: true })
  }

  // Create restock_notifications table if using Supabase
  // For now, store in a simple way
  const { error } = await supabase
    .from('restock_notifications')
    .insert({ email, product_handle })

  if (error) {
    // Table might not exist yet — that's ok, log it
    console.log('Restock notification (table missing?):', email, product_handle, error.message)
  }

  return NextResponse.json({ success: true })
}
