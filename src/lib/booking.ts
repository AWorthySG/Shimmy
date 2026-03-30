export interface BookingService {
  id: string
  name: string
  duration: number // minutes
  price: string
}

export const BOOKING_SERVICES: BookingService[] = [
  // TODO: Update prices with actual values
  { id: 'embroidery', name: 'Eyebrow Embroidery', duration: 120, price: 'From $XXX' },
  { id: 'microblading', name: 'Microblading', duration: 120, price: 'From $XXX' },
  { id: 'nano', name: 'Nano Brows', duration: 120, price: 'From $XXX' },
  { id: 'ombre', name: 'Ombre Powder Brows', duration: 120, price: 'From $XXX' },
  { id: 'shaping', name: 'Brow Shaping', duration: 45, price: 'From $XXX' },
  { id: 'lip', name: 'Lip Blush', duration: 120, price: 'From $XXX' },
]

// Operating hours per day-of-week (0 = Sunday, 6 = Saturday)
// null = closed
export const OPERATING_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,                          // Sunday — closed
  1: { open: '10:00', close: '19:00' }, // Monday
  2: { open: '10:00', close: '19:00' }, // Tuesday
  3: { open: '10:00', close: '19:00' }, // Wednesday
  4: { open: '10:00', close: '19:00' }, // Thursday
  5: { open: '10:00', close: '19:00' }, // Friday
  6: { open: '10:00', close: '17:00' }, // Saturday
}

// Minimum slot granularity in minutes
export const SLOT_INTERVAL = 30

// Buffer between appointments in minutes
export const BUFFER_MINUTES = 15

// How many days ahead clients can book
export const MAX_ADVANCE_DAYS = 60

// Timezone for all booking logic
export const TIMEZONE = 'Asia/Singapore'

export interface Booking {
  id: string
  service_id: string
  service_name: string
  date: string        // YYYY-MM-DD
  time: string        // HH:MM (24h)
  duration_minutes: number
  client_name: string
  client_email: string | null
  client_phone: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes: string | null
  created_at: string
}

/**
 * Generate all possible time slots for a given day-of-week and service duration.
 * Returns an array of "HH:MM" strings.
 */
export function generateAllSlots(dayOfWeek: number, durationMinutes: number): string[] {
  const hours = OPERATING_HOURS[dayOfWeek]
  if (!hours) return []

  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close.split(':').map(Number)
  const openTotal = openH * 60 + openM
  const closeTotal = closeH * 60 + closeM

  const slots: string[] = []
  for (let t = openTotal; t + durationMinutes + BUFFER_MINUTES <= closeTotal; t += SLOT_INTERVAL) {
    const h = Math.floor(t / 60)
    const m = t % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }

  return slots
}

/**
 * Check if two time ranges overlap.
 */
export function timesOverlap(
  startA: string, durationA: number,
  startB: string, durationB: number,
): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  const aStart = toMin(startA)
  const aEnd = aStart + durationA + BUFFER_MINUTES
  const bStart = toMin(startB)
  const bEnd = bStart + durationB + BUFFER_MINUTES
  return aStart < bEnd && bStart < aEnd
}
