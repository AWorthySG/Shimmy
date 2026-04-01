import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * POST /api/referral
 * Creates a new referral code.
 * Body: { name: string }
 * Returns the shareable link.
 */
export async function POST(request: NextRequest) {
  const { name } = await request.json()

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const code = generateCode()

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    // Supabase not configured — return code anyway
    return NextResponse.json({
      success: true,
      code,
      link: `https://shimmyhands.com/ref/${code}`,
    })
  }

  const { error } = await supabase.from('referrals').insert({
    code,
    referrer_name: name.trim(),
    uses: 0,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.log('Referral insert (table missing?):', error.message)
  }

  return NextResponse.json({
    success: true,
    code,
    link: `https://shimmyhands.com/ref/${code}`,
  })
}

/**
 * GET /api/referral?code=XXX
 * Looks up a referral code and increments its uses count.
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
    // Supabase not configured
    return NextResponse.json({ success: true, code })
  }

  // Look up the referral code
  const { data, error: selectError } = await supabase
    .from('referrals')
    .select('code, referrer_name, uses')
    .eq('code', code)
    .single()

  if (selectError || !data) {
    return NextResponse.json({ error: 'Referral code not found' }, { status: 404 })
  }

  // Increment uses
  const { error: updateError } = await supabase
    .from('referrals')
    .update({ uses: (data.uses ?? 0) + 1 })
    .eq('code', code)

  if (updateError) {
    console.log('Referral update error:', updateError.message)
  }

  return NextResponse.json({ success: true, code, referrer: data.referrer_name })
}
