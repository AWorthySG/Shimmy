import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

/**
 * GET /api/reviews
 *
 * Public. Returns featured reviews ordered by review_date desc, limit 10.
 */
export async function GET() {
  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ reviews: [] })
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, author_name, rating, text, source, service_type, avatar_url, review_date')
      .eq('is_featured', true)
      .order('review_date', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Failed to fetch reviews:', error.message)
      return NextResponse.json({ reviews: [] })
    }

    return NextResponse.json({ reviews: data ?? [] })
  } catch {
    return NextResponse.json({ reviews: [] })
  }
}

/**
 * POST /api/reviews
 *
 * Admin-only. Create a new review.
 */
export async function POST(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { author_name, rating, text, source, service_type, is_featured } = body

    if (!author_name || !rating || !text) {
      return NextResponse.json(
        { error: 'author_name, rating, and text are required' },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'rating must be between 1 and 5' },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        author_name,
        rating,
        text,
        source: source ?? 'manual',
        service_type: service_type ?? null,
        is_featured: is_featured ?? false,
        review_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to insert review:', error.message)
      return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
    }

    return NextResponse.json({ review: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
