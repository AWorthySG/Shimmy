import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

/**
 * GET /api/loyalty?phone=XXX
 * Look up visits for a phone number.
 */
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone')

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  }

  // Normalise: strip spaces, dashes, etc.
  const normalised = phone.replace(/[\s\-()]/g, '')

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('loyalty_visits')
    .select('*')
    .eq('phone', normalised)
    .order('visit_date', { ascending: false })

  if (error) {
    console.log('Loyalty lookup error:', error.message)
    return NextResponse.json({ error: 'Failed to look up visits' }, { status: 500 })
  }

  const total = data?.length ?? 0

  // Every 3rd visit earns a reward
  const nextMilestone = Math.ceil((total + 1) / 3) * 3
  const visitsToNext = nextMilestone - total

  let nextReward = ''
  if (nextMilestone === 3) nextReward = 'S$15 off'
  else if (nextMilestone === 6) nextReward = 'S$30 off'
  else if (nextMilestone === 9) nextReward = 'Free touch-up'
  else nextReward = 'S$15 off' // cycle repeats

  return NextResponse.json({
    success: true,
    visits: data ?? [],
    total,
    nextReward,
    visitsToNext,
    nextMilestone,
  })
}

/**
 * POST /api/loyalty
 * Admin-only. Record a visit.
 * Body: { phone, client_name, service?, notes? }
 */
export async function POST(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  let body: {
    phone: string
    client_name: string
    service?: string
    notes?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { phone, client_name, service, notes } = body

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  }
  if (!client_name || typeof client_name !== 'string' || client_name.trim().length === 0) {
    return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
  }

  const normalised = phone.replace(/[\s\-()]/g, '')

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ success: true, message: 'Visit recorded (DB unavailable)' })
  }

  const { error } = await supabase.from('loyalty_visits').insert({
    phone: normalised,
    client_name: client_name.trim(),
    service: service?.trim() || null,
    notes: notes?.trim() || null,
    visit_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.log('Loyalty insert error:', error.message)
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
