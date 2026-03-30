import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  BOOKING_SERVICES,
  generateAllSlots,
  timesOverlap,
  TIMEZONE,
} from '@/lib/booking'

/**
 * POST /api/bookings
 *
 * Creates a new booking.
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { service_id, date, time, client_name, client_email, client_phone, notes } = body

  // Validate required fields
  if (!service_id || !date || !time || !client_name || !client_phone) {
    return NextResponse.json(
      { error: 'Missing required fields: service_id, date, time, client_name, client_phone' },
      { status: 400 },
    )
  }

  // Validate phone format (basic: must have digits)
  if (!/\d{7,}/.test(client_phone.replace(/[\s\-\+\(\)]/g, ''))) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }

  // Validate email if provided
  if (client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Validate service
  const service = BOOKING_SERVICES.find((s) => s.id === service_id)
  if (!service) {
    return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
  }

  // Validate date is not in the past
  const bookingDate = new Date(date + 'T00:00:00')
  const now = new Date()
  const sgNow = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }))
  const today = new Date(sgNow.getFullYear(), sgNow.getMonth(), sgNow.getDate())
  if (bookingDate < today) {
    return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
  }

  // Validate the slot is valid for this day
  const dayOfWeek = bookingDate.getDay()
  const allSlots = generateAllSlots(dayOfWeek, service.duration)
  if (!allSlots.includes(time)) {
    return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 })
  }

  // Check if date is blocked
  const { data: blocked } = await supabase
    .from('blocked_dates')
    .select('id')
    .eq('date', date)
    .limit(1)

  if (blocked && blocked.length > 0) {
    return NextResponse.json({ error: 'This date is not available' }, { status: 400 })
  }

  // Check for conflicts with existing bookings
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('time, duration_minutes')
    .eq('date', date)
    .neq('status', 'cancelled')

  if (existingBookings) {
    const hasConflict = existingBookings.some((booking) =>
      timesOverlap(time, service.duration, booking.time, booking.duration_minutes),
    )
    if (hasConflict) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another time.' },
        { status: 409 },
      )
    }
  }

  // Create the booking
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      service_id,
      service_name: service.name,
      date,
      time,
      duration_minutes: service.duration,
      client_name: client_name.trim(),
      client_email: client_email?.trim() || null,
      client_phone: client_phone.trim(),
      notes: notes?.trim() || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }

  return NextResponse.json({
    booking: data,
    message: 'Booking request submitted! We will confirm your appointment shortly.',
  }, { status: 201 })
}

/**
 * GET /api/bookings?date=2024-03-15
 *
 * List bookings for a date (for admin/availability display).
 * Only returns non-cancelled bookings with limited fields.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const dateStr = searchParams.get('date')

  if (!dateStr) {
    return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('date, time, duration_minutes, service_name, status')
    .eq('date', dateStr)
    .neq('status', 'cancelled')
    .order('time')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }

  return NextResponse.json({ bookings: data })
}
