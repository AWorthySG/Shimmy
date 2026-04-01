import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { date, reason } = await request.json()

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('blocked_dates')
    .upsert({ date, reason: reason || null }, { onConflict: 'date' })

  if (error) {
    return NextResponse.json({ error: 'Failed to block date' }, { status: 500 })
  }

  return NextResponse.json({ success: true, date })
}
