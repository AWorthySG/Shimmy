'use client'

import { useState, useEffect, useCallback } from 'react'

// Simple password gate — not production auth, just a basic barrier
const ADMIN_PASS = 'shimmy2024' // TODO: Move to env var for production
const ADMIN_HEADERS = { 'x-admin-key': ADMIN_PASS }

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

interface Lead {
  id: string
  name: string
  phone: string
  email: string | null
  style_id: string
  style_name: string
  created_at: string
}

interface AnalyticsData {
  period: string
  summary: {
    pageViews: number
    tryOnCompletions: number
    cartAdds: number
    leadsSaved: number
  }
  topPages: { page: string; count: number }[]
  topEvents: { event: string; count: number }[]
  daily: { date: string; count: number }[]
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
  const [activeTab, setActiveTab] = useState<'bookings' | 'leads' | 'analytics'>('bookings')
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsTotal, setLeadsTotal] = useState(0)
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [leadsPage, setLeadsPage] = useState(0)
  const LEADS_PER_PAGE = 20
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [showAllPages, setShowAllPages] = useState(false)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const ANALYTICS_ROWS_DEFAULT = 5

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
      const res = await fetch(`/api/bookings?date=${selectedDate}`, {
        headers: ADMIN_HEADERS,
      })
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch {
      setBookings([])
    }
    setLoading(false)
  }, [selectedDate])

  const fetchLeads = useCallback(async (page = 0) => {
    setLeadsLoading(true)
    try {
      const res = await fetch(`/api/admin/leads?limit=${LEADS_PER_PAGE}&offset=${page * LEADS_PER_PAGE}`, {
        headers: ADMIN_HEADERS,
      })
      const data = await res.json()
      setLeads(data.leads || [])
      setLeadsTotal(data.total || 0)
    } catch {
      setLeads([])
    }
    setLeadsLoading(false)
  }, [])

  const fetchAnalytics = useCallback(async (period: '7d' | '30d' | '90d') => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch(`/api/analytics?period=${period}`, {
        headers: ADMIN_HEADERS,
      })
      const data = await res.json()
      setAnalyticsData(data)
    } catch {
      setAnalyticsData(null)
    }
    setAnalyticsLoading(false)
  }, [])

  useEffect(() => {
    if (authed) fetchBookings()
  }, [authed, fetchBookings])

  useEffect(() => {
    if (authed && activeTab === 'leads') fetchLeads(leadsPage)
  }, [authed, activeTab, leadsPage, fetchLeads])

  useEffect(() => {
    if (authed && activeTab === 'analytics') fetchAnalytics(analyticsPeriod)
  }, [authed, activeTab, analyticsPeriod, fetchAnalytics])

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    setUpdatingId(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...ADMIN_HEADERS },
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
        headers: { 'Content-Type': 'application/json', ...ADMIN_HEADERS },
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

      {/* Tabs */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6">
        <div className="flex gap-1 border-b border-vermillion/10">
          {([['bookings', 'Bookings'], ['leads', 'Try-On Leads'], ['analytics', 'Analytics']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px ${
                activeTab === key
                  ? 'border-vermillion text-vermillion'
                  : 'border-transparent text-warm-gray hover:text-charcoal'
              }`}
            >
              {label}
              {key === 'leads' && leadsTotal > 0 && (
                <span className="ml-2 inline-flex items-center justify-center bg-vermillion/10 text-vermillion text-[10px] px-1.5 py-0.5 rounded-full">{leadsTotal}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 grid gap-8 lg:grid-cols-3">
        {/* Left: Bookings view */}
        {activeTab === 'bookings' && <><div className="lg:col-span-2">
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
        </>}

        {/* ─── Analytics tab ─── */}
        {activeTab === 'analytics' && <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-charcoal">Analytics</h2>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setAnalyticsPeriod(p)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-[0.15em] border transition-colors ${
                    analyticsPeriod === p
                      ? 'border-vermillion bg-vermillion text-soft-white'
                      : 'border-vermillion/20 text-charcoal hover:border-vermillion/50'
                  }`}
                >
                  {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {analyticsLoading ? (
            <p className="text-sm text-warm-gray">Loading...</p>
          ) : !analyticsData?.summary ? (
            <div className="border border-vermillion/10 bg-soft-white p-8 text-center">
              <p className="text-sm text-warm-gray">No analytics data for this period.</p>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Page Views', value: analyticsData.summary.pageViews },
                  { label: 'Try-On Completions', value: analyticsData.summary.tryOnCompletions },
                  { label: 'Cart Adds', value: analyticsData.summary.cartAdds },
                  { label: 'Leads Saved', value: analyticsData.summary.leadsSaved },
                ].map((card) => (
                  <div key={card.label} className="border border-vermillion/15 bg-soft-white p-5 text-center">
                    <p className="font-serif text-2xl text-vermillion">{card.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-warm-gray">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Top Pages */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border border-vermillion/15 bg-soft-white p-5">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-4">Top Pages</h3>
                  {analyticsData.topPages.length === 0 ? (
                    <p className="text-sm text-warm-gray">No page data.</p>
                  ) : (
                    <>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-vermillion/10">
                            <th className="text-left text-[10px] uppercase tracking-[0.15em] text-warm-gray py-2">Page</th>
                            <th className="text-right text-[10px] uppercase tracking-[0.15em] text-warm-gray py-2">Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(showAllPages ? analyticsData.topPages : analyticsData.topPages.slice(0, ANALYTICS_ROWS_DEFAULT)).map((p) => (
                            <tr key={p.page} className="border-b border-vermillion/5">
                              <td className="py-2 text-sm text-charcoal">{p.page}</td>
                              <td className="py-2 text-sm text-charcoal text-right font-medium">{p.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {analyticsData.topPages.length > ANALYTICS_ROWS_DEFAULT && (
                        <button
                          onClick={() => setShowAllPages((v) => !v)}
                          className="mt-3 text-xs text-vermillion-dark hover:text-vermillion transition-colors uppercase tracking-[0.15em]"
                        >
                          {showAllPages ? 'Show less' : 'Show all'}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Top Events */}
                <div className="border border-vermillion/15 bg-soft-white p-5">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-4">Top Events</h3>
                  {analyticsData.topEvents.length === 0 ? (
                    <p className="text-sm text-warm-gray">No event data.</p>
                  ) : (
                    <>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-vermillion/10">
                            <th className="text-left text-[10px] uppercase tracking-[0.15em] text-warm-gray py-2">Event</th>
                            <th className="text-right text-[10px] uppercase tracking-[0.15em] text-warm-gray py-2">Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(showAllEvents ? analyticsData.topEvents : analyticsData.topEvents.slice(0, ANALYTICS_ROWS_DEFAULT)).map((e) => (
                            <tr key={e.event} className="border-b border-vermillion/5">
                              <td className="py-2 text-sm text-charcoal">{e.event}</td>
                              <td className="py-2 text-sm text-charcoal text-right font-medium">{e.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {analyticsData.topEvents.length > ANALYTICS_ROWS_DEFAULT && (
                        <button
                          onClick={() => setShowAllEvents((v) => !v)}
                          className="mt-3 text-xs text-vermillion-dark hover:text-vermillion transition-colors uppercase tracking-[0.15em]"
                        >
                          {showAllEvents ? 'Show less' : 'Show all'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>}

        {/* ─── Leads tab ─── */}
        {activeTab === 'leads' && <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-charcoal">
              Try-On Leads
              {leadsTotal > 0 && <span className="ml-2 text-sm font-normal text-warm-gray">({leadsTotal} total)</span>}
            </h2>
            <button
              onClick={() => fetchLeads(leadsPage)}
              className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors"
            >
              Refresh
            </button>
          </div>

          {leadsLoading ? (
            <p className="text-sm text-warm-gray">Loading...</p>
          ) : leads.length === 0 ? (
            <div className="border border-vermillion/10 bg-soft-white p-8 text-center">
              <p className="text-sm text-warm-gray">No leads yet. When clients save a look from the brow try-on, they&apos;ll appear here.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-vermillion/15">
                      <th className="text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark py-3 pr-4">Name</th>
                      <th className="text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark py-3 pr-4">WhatsApp</th>
                      <th className="text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark py-3 pr-4">Email</th>
                      <th className="text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark py-3 pr-4">Style</th>
                      <th className="text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark py-3 pr-4">Date</th>
                      <th className="text-right text-[10px] uppercase tracking-[0.2em] text-vermillion-dark py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-vermillion/8 hover:bg-cream/30 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="text-sm text-charcoal font-medium">{lead.name}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^+\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-vermillion hover:text-vermillion-dark transition-colors"
                          >
                            {lead.phone}
                          </a>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-sm text-charcoal-light">{lead.email || '—'}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-vermillion-dark border border-vermillion/20 bg-vermillion/5 px-2 py-0.5">
                            {lead.style_name}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-xs text-warm-gray">
                            {new Date(lead.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-warm-gray/60">
                            {new Date(lead.created_at).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="py-3 text-right">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^+\d]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}! You recently tried the ${lead.style_name} look on our brow visualizer — shall we book a consultation?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 bg-jade text-soft-white hover:bg-jade/80 transition-colors"
                          >
                            Follow up
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {leadsTotal > LEADS_PER_PAGE && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-warm-gray">
                    Showing {leadsPage * LEADS_PER_PAGE + 1}–{Math.min((leadsPage + 1) * LEADS_PER_PAGE, leadsTotal)} of {leadsTotal}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLeadsPage((p) => Math.max(0, p - 1))}
                      disabled={leadsPage === 0}
                      className="text-xs uppercase tracking-[0.15em] px-3 py-1.5 border border-vermillion/20 text-charcoal hover:border-vermillion/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setLeadsPage((p) => p + 1)}
                      disabled={(leadsPage + 1) * LEADS_PER_PAGE >= leadsTotal}
                      className="text-xs uppercase tracking-[0.15em] px-3 py-1.5 border border-vermillion/20 text-charcoal hover:border-vermillion/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>}
      </div>
    </div>
  )
}
