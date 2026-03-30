import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  BOOKING_SERVICES,
  generateAllSlots,
  timesOverlap,
  MAX_ADVANCE_DAYS,
  TIMEZONE,
} from '@/lib/booking'

/**
 * GET /api/bookings/slots?date=2024-03-15&service=nano
 *
 * Returns available time slots for a given date and service.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const dateStr = searchParams.get('date')
  const serviceId = searchParams.get('service')

  if (!dateStr || !serviceId) {
    return NextResponse.json(
      { error: 'Missing required parameters: date, service' },
      { status: 400 },
    )
  }

  // Validate service
  const service = BOOKING_SERVICES.find((s) => s.id === serviceId)
  if (!service) {
    return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
  }

  // Validate date format
  const date = new Date(dateStr + 'T00:00:00')
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  // Check date is not in the past
  const now = new Date()
  const sgNow = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }))
  const today = new Date(sgNow.getFullYear(), sgNow.getMonth(), sgNow.getDate())
  if (date < today) {
    return NextResponse.json({ slots: [] })
  }

  // Check date is not too far in the future
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS)
  if (date > maxDate) {
    return NextResponse.json({ slots: [], message: 'Date too far in advance' })
  }

  // Check if date is blocked
  const { data: blocked } = await supabase
    .from('blocked_dates')
    .select('id')
    .eq('date', dateStr)
    .limit(1)

  if (blocked && blocked.length > 0) {
    return NextResponse.json({ slots: [], blocked: true })
  }

  // Get all possible slots for this day
  const dayOfWeek = date.getDay()
  const allSlots = generateAllSlots(dayOfWeek, service.duration)

  if (allSlots.length === 0) {
    return NextResponse.json({ slots: [], closed: true })
  }

  // Get existing bookings for this date
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('time, duration_minutes')
    .eq('date', dateStr)
    .neq('status', 'cancelled')

  // Filter out slots that conflict with existing bookings
  const availableSlots = allSlots.filter((slot) => {
    if (!existingBookings) return true
    return !existingBookings.some((booking) =>
      timesOverlap(slot, service.duration, booking.time, booking.duration_minutes),
    )
  })

  // If the date is today, filter out past slots
  if (date.getTime() === today.getTime()) {
    const currentMinutes = sgNow.getHours() * 60 + sgNow.getMinutes()
    return NextResponse.json({
      slots: availableSlots.filter((slot) => {
        const [h, m] = slot.split(':').map(Number)
        return h * 60 + m > currentMinutes + 30 // at least 30 min from now
      }),
    })
  }

  return NextResponse.json({ slots: availableSlots })
}
