'use client'

import { useState, useEffect, useCallback } from 'react'

// Simple password gate — not production auth, just a basic barrier
const ADMIN_PASS = 'shimmy2024' // TODO: Move to env var for production

interface Booking {
  id: string
  service_name: string
  date: string
  time: string
  duration_minutes: number
  client_name: string
  client_email: string | null
  client_phone: string
  status: string
  notes: string | null
  created_at: string
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [passError, setPassError] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [blockDate, setBlockDate] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleLogin = () => {
    if (pass === ADMIN_PASS) {
      setAuthed(true)
      setPassError(false)
    } else {
      setPassError(true)
    }
  }

  const fetchBookings = useCallback(async () => {
    if (!selectedDate) return
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings?date=${selectedDate}`)
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch {
      setBookings([])
    }
    setLoading(false)
  }, [selectedDate])

  useEffect(() => {
    if (authed) fetchBookings()
  }, [authed, fetchBookings])

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    setUpdatingId(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        await fetchBookings()
      } else {
        const data = await res.json()
        setActionMsg(data.error || 'Failed to update booking')
        setTimeout(() => setActionMsg(''), 3000)
      }
    } catch {
      setActionMsg('Network error')
      setTimeout(() => setActionMsg(''), 3000)
    }
    setUpdatingId(null)
  }

  const handleBlockDate = async () => {
    if (!blockDate) return
    try {
      const res = await fetch('/api/admin/block-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: blockDate, reason: blockReason || null }),
      })
      if (res.ok) {
        setActionMsg(`Blocked ${blockDate}`)
        setBlockDate('')
        setBlockReason('')
      } else {
        const data = await res.json()
        setActionMsg(data.error || 'Failed to block date')
      }
    } catch {
      setActionMsg('Network error')
    }
    setTimeout(() => setActionMsg(''), 3000)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-sm w-full border border-vermillion/15 bg-soft-white p-8">
          <h1 className="font-serif text-2xl text-charcoal text-center mb-6">Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setPassError(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50"
          />
          {passError && <p className="text-xs text-red-500 mt-2">Incorrect password</p>}
          <button
            onClick={handleLogin}
            className="mt-4 w-full bg-vermillion text-soft-white py-3 text-xs uppercase tracking-[0.2em] hover:bg-vermillion-dark transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-charcoal text-soft-white px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <h1 className="font-serif text-xl tracking-wide">Shimmy Admin</h1>
          <button onClick={() => setAuthed(false)} className="text-xs text-soft-white/60 hover:text-soft-white">
            Log Out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 grid gap-8 lg:grid-cols-3">
        {/* Left: Bookings view */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-xl text-charcoal">Bookings</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-vermillion/20 bg-soft-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-vermillion/50"
            />
            <button
              onClick={fetchBookings}
              className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-warm-gray">Loading...</p>
          ) : bookings.length === 0 ? (
            <div className="border border-vermillion/10 bg-soft-white p-8 text-center">
              <p className="text-sm text-warm-gray">No bookings for {selectedDate}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="border border-vermillion/15 bg-soft-white p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-base text-charcoal">{b.client_name}</p>
                      <p className="text-xs text-warm-gray mt-1">{b.client_phone}</p>
                      {b.client_email && <p className="text-xs text-warm-gray">{b.client_email}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-charcoal">{formatTime(b.time)}</p>
                      <p className="text-xs text-warm-gray">{b.duration_minutes} min</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-vermillion-dark border border-vermillion/20 bg-vermillion/5 px-2 py-0.5">
                      {b.service_name}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border ${
                      b.status === 'confirmed' ? 'text-jade border-jade/20 bg-jade/5' :
                      b.status === 'cancelled' ? 'text-red-500 border-red-200 bg-red-50' :
                      'text-gold border-gold/20 bg-gold/5'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  {b.notes && <p className="mt-2 text-xs text-charcoal-light italic">{b.notes}</p>}
                  {b.status === 'pending' && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(b.id, 'confirmed')}
                        disabled={updatingId === b.id}
                        className="text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 bg-jade text-soft-white hover:bg-jade/80 transition-colors disabled:opacity-50"
                      >
                        {updatingId === b.id ? '...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(b.id, 'cancelled')}
                        disabled={updatingId === b.id}
                        className="text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 bg-red-500 text-soft-white hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {updatingId === b.id ? '...' : 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick actions */}
        <div className="space-y-6">
          {/* Block date */}
          <div className="border border-vermillion/15 bg-soft-white p-5">
            <h3 className="text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-4">Block a Date</h3>
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="w-full border border-vermillion/20 bg-soft-white px-3 py-2 text-sm text-charcoal mb-2 focus:outline-none focus:border-vermillion/50"
            />
            <input
              type="text"
              placeholder="Reason (optional)"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="w-full border border-vermillion/20 bg-soft-white px-3 py-2 text-sm text-charcoal mb-3 placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50"
            />
            <button
              onClick={handleBlockDate}
              className="w-full bg-charcoal text-soft-white py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-charcoal/80 transition-colors"
            >
              Block Date
            </button>
            {actionMsg && <p className="text-xs text-jade mt-2">{actionMsg}</p>}
          </div>

          {/* Quick stats */}
          <div className="border border-vermillion/15 bg-soft-white p-5">
            <h3 className="text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-4">Today&apos;s Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">Total bookings</span>
                <span className="text-charcoal font-medium">{bookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">Pending</span>
                <span className="text-gold font-medium">{bookings.filter(b => b.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">Confirmed</span>
                <span className="text-jade font-medium">{bookings.filter(b => b.status === 'confirmed').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
