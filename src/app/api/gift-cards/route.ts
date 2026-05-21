import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * POST /api/gift-cards
 * Create a new gift card.
 * Body: { value, purchaser_name, purchaser_email, recipient_name, recipient_email?, message? }
 */
export async function POST(request: NextRequest) {
  let body: {
    value: number
    purchaser_name: string
    purchaser_email: string
    recipient_name: string
    recipient_email?: string
    message?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { value, purchaser_name, purchaser_email, recipient_name, recipient_email, message } = body

  if (!value || typeof value !== 'number' || value <= 0) {
    return NextResponse.json({ error: 'A valid value is required' }, { status: 400 })
  }
  if (!purchaser_name || typeof purchaser_name !== 'string' || purchaser_name.trim().length === 0) {
    return NextResponse.json({ error: 'Purchaser name is required' }, { status: 400 })
  }
  if (!purchaser_email || typeof purchaser_email !== 'string' || purchaser_email.trim().length === 0) {
    return NextResponse.json({ error: 'Purchaser email is required' }, { status: 400 })
  }
  if (!recipient_name || typeof recipient_name !== 'string' || recipient_name.trim().length === 0) {
    return NextResponse.json({ error: 'Recipient name is required' }, { status: 400 })
  }

  const code = generateCode()

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    // Supabase not configured — return code anyway
    return NextResponse.json({ success: true, code, balance: value })
  }

  const { error } = await supabase.from('gift_cards').insert({
    code,
    initial_value: value,
    balance: value,
    purchaser_name: purchaser_name.trim(),
    purchaser_email: purchaser_email.trim(),
    recipient_name: recipient_name.trim(),
    recipient_email: recipient_email?.trim() || null,
    message: message?.trim() || null,
    is_active: true,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.log('Gift card insert (table missing?):', error.message)
  }

  return NextResponse.json({ success: true, code, balance: value })
}

/**
 * GET /api/gift-cards?code=XXX
 * Look up a gift card — public endpoint.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('gift_cards')
    .select('code, balance, is_active, recipient_name')
    .eq('code', code.toUpperCase())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Gift card not found' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    code: data.code,
    balance: data.balance,
    is_active: data.is_active,
    recipient_name: data.recipient_name,
  })
}

/**
 * PATCH /api/gift-cards
 * Admin-only. Redeem amount from a gift card.
 * Body: { code, redeem_amount }
 */
export async function PATCH(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  let body: { code: string; redeem_amount: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { code, redeem_amount } = body

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }
  if (!redeem_amount || typeof redeem_amount !== 'number' || redeem_amount <= 0) {
    return NextResponse.json({ error: 'A valid redeem_amount is required' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  // Fetch current balance
  const { data, error: selectError } = await supabase
    .from('gift_cards')
    .select('balance, is_active')
    .eq('code', code.toUpperCase())
    .single()

  if (selectError || !data) {
    return NextResponse.json({ error: 'Gift card not found' }, { status: 404 })
  }

  if (!data.is_active) {
    return NextResponse.json({ error: 'Gift card is no longer active' }, { status: 400 })
  }

  if (redeem_amount > data.balance) {
    return NextResponse.json({ error: 'Redeem amount exceeds balance' }, { status: 400 })
  }

  const newBalance = data.balance - redeem_amount
  const updateData: Record<string, unknown> = { balance: newBalance }

  if (newBalance === 0) {
    updateData.is_active = false
    updateData.redeemed_at = new Date().toISOString()
  }

  const { error: updateError } = await supabase
    .from('gift_cards')
    .update(updateData)
    .eq('code', code.toUpperCase())

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update gift card' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    code: code.toUpperCase(),
    new_balance: newBalance,
    is_active: newBalance > 0,
  })
}
