import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/**
 * Cart session persistence via Supabase.
 *
 * Required table:
 *
 * CREATE TABLE IF NOT EXISTS cart_sessions (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   session_id TEXT NOT NULL UNIQUE,
 *   items JSONB NOT NULL DEFAULT '[]',
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Anyone can manage cart sessions" ON cart_sessions FOR ALL TO anon USING (true) WITH CHECK (true);
 */

/**
 * GET /api/cart?session=UUID
 * Returns the cart items for a given session.
 */
export async function GET(request: NextRequest) {
  const session = request.nextUrl.searchParams.get('session')

  if (!session) {
    return NextResponse.json({ items: [] })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ items: [] })
  }

  try {
    const { data, error } = await supabase
      .from('cart_sessions')
      .select('items')
      .eq('session_id', session)
      .single()

    if (error || !data) {
      return NextResponse.json({ items: [] })
    }

    return NextResponse.json({ items: data.items })
  } catch {
    return NextResponse.json({ items: [] })
  }
}

/**
 * POST /api/cart
 * Body: { session: string, items: CartItem[] }
 * Saves/updates the cart in Supabase for the given session.
 */
export async function POST(request: NextRequest) {
  const { session, items } = await request.json()

  if (!session) {
    return NextResponse.json({ error: 'Missing session' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ success: true })
  }

  try {
    const { error } = await supabase
      .from('cart_sessions')
      .upsert(
        { session_id: session, items: items ?? [], updated_at: new Date().toISOString() },
        { onConflict: 'session_id' },
      )

    if (error) {
      console.log('Cart sync (table missing?):', error.message)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
