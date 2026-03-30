'use client'

import { useState, useEffect, useCallback } from 'react'
import { BOOKING_SERVICES, MAX_ADVANCE_DAYS, type BookingService } from '@/lib/booking'
import { useI18n } from '@/lib/i18n'

type Step = 'service' | 'date' | 'time' | 'details' | 'confirm' | 'done'

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// Simple calendar component
function Calendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: string | null
  onSelect: (date: string) => void
}) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS)

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1)
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setViewMonth(prev)
    }
  }
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1)
    if (next <= maxDate) {
      setViewMonth(next)
    }
  }

  const monthLabel = viewMonth.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 text-charcoal-light hover:text-vermillion transition-colors touch-target"
        >
          ←
        </button>
        <span className="font-serif text-base text-charcoal">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="p-2 text-charcoal-light hover:text-vermillion transition-colors touch-target"
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-[10px] uppercase tracking-[0.1em] text-warm-gray py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const dateStr = formatDate(date)
          const isPast = date < today
          const isTooFar = date > maxDate
          const isSunday = date.getDay() === 0
          const isDisabled = isPast || isTooFar || isSunday
          const isSelected = dateStr === selectedDate

          return (
            <button
              key={day}
              onClick={() => !isDisabled && onSelect(dateStr)}
              disabled={isDisabled}
              className={`aspect-square flex items-center justify-center text-sm transition-all duration-200 ${
                isSelected
                  ? 'bg-vermillion text-soft-white'
                  : isDisabled
                    ? 'text-warm-gray/30 cursor-not-allowed'
                    : 'text-charcoal hover:bg-vermillion/10 hover:text-vermillion cursor-pointer'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function BookingForm() {
  const { t } = useI18n()
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<BookingService | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsMessage, setSlotsMessage] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [bookingResult, setBookingResult] = useState<{ id: string; message: string } | null>(null)

  // Fetch available slots when date or service changes
  const fetchSlots = useCallback(async () => {
    if (!selectedDate || !selectedService) return
    setSlotsLoading(true)
    setSlotsMessage('')
    setSelectedTime(null)
    try {
      const res = await fetch(
        `/api/bookings/slots?date=${selectedDate}&service=${selectedService.id}`,
      )
      const data = await res.json()
      setSlots(data.slots || [])
      if (data.closed) setSlotsMessage(t('book.step.time.closed'))
      else if (data.blocked) setSlotsMessage(t('book.step.time.blocked'))
      else if ((data.slots || []).length === 0) setSlotsMessage(t('book.step.time.none'))
    } catch {
      setSlotsMessage(t('book.step.time.fail'))
      setSlots([])
    }
    setSlotsLoading(false)
  }, [selectedDate, selectedService])

  useEffect(() => {
    if (step === 'time') {
      fetchSlots()
    }
  }, [step, fetchSlots])

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone) return

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: selectedService.id,
          date: selectedDate,
          time: selectedTime,
          client_name: clientName,
          client_email: clientEmail || null,
          client_phone: clientPhone,
          notes: notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('book.error.generic'))
      } else {
        setBookingResult({ id: data.booking.id, message: data.message })
        setStep('done')
      }
    } catch {
      setError(t('book.error.network'))
    }
    setSubmitting(false)
  }

  const resetBooking = () => {
    setStep('service')
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setClientName('')
    setClientEmail('')
    setClientPhone('')
    setNotes('')
    setError('')
    setBookingResult(null)
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress indicator */}
      {step !== 'done' && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['service', 'date', 'time', 'details', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  s === step
                    ? 'bg-vermillion scale-125'
                    : ['service', 'date', 'time', 'details', 'confirm'].indexOf(s) <
                        ['service', 'date', 'time', 'details', 'confirm'].indexOf(step)
                      ? 'bg-vermillion/40'
                      : 'bg-vermillion/15'
                }`}
              />
              {i < 4 && <div className="w-6 h-[1px] bg-vermillion/15" />}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Select Service */}
      {step === 'service' && (
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal text-center mb-2">
            Select a Service
          </h3>
          <p className="text-sm text-charcoal-light text-center mb-8">
            Choose the service you&apos;d like to book.
          </p>
          <div className="space-y-3">
            {BOOKING_SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service)
                  setStep('date')
                }}
                className="w-full flex items-center justify-between border border-vermillion/15 bg-cream/30 px-5 sm:px-6 py-4 sm:py-5 text-left transition-all duration-300 hover:border-vermillion/40 hover:shadow-md hover:shadow-vermillion/5 touch-target shine-on-hover"
              >
                <div>
                  <p className="font-serif text-base sm:text-lg text-charcoal">{service.name}</p>
                  <p className="mt-1 text-xs text-warm-gray">
                    {service.duration} min · {service.price}
                  </p>
                </div>
                <span className="text-vermillion text-sm">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Date */}
      {step === 'date' && (
        <div>
          <button
            onClick={() => setStep('service')}
            className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors mb-6 touch-target"
          >
            ← Back
          </button>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal text-center mb-2">
            Pick a Date
          </h3>
          <p className="text-sm text-charcoal-light text-center mb-6">
            {selectedService?.name} · {selectedService?.duration} min
          </p>
          <div className="border border-vermillion/15 bg-cream/30 p-4 sm:p-6">
            <Calendar
              selectedDate={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                setStep('time')
              }}
            />
          </div>
          <p className="text-[10px] text-warm-gray text-center mt-3">
            {t("book.step.date.note")}
          </p>
        </div>
      )}

      {/* Step 3: Select Time */}
      {step === 'time' && (
        <div>
          <button
            onClick={() => setStep('date')}
            className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors mb-6 touch-target"
          >
            ← Back
          </button>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal text-center mb-2">
            Choose a Time
          </h3>
          <p className="text-sm text-charcoal-light text-center mb-6">
            {selectedService?.name} · {selectedDate && formatDisplayDate(selectedDate)}
          </p>

          {slotsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-6 h-6 border-2 border-vermillion/20 border-t-vermillion rounded-full animate-spin" />
              <p className="mt-3 text-sm text-warm-gray">{t("book.step.time.loading")}</p>
            </div>
          ) : slotsMessage ? (
            <div className="text-center py-12">
              <p className="text-sm text-charcoal-light">{slotsMessage}</p>
              <button
                onClick={() => setStep('date')}
                className="mt-4 text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors touch-target"
              >
                Choose another date
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedTime(slot)
                    setStep('details')
                  }}
                  className={`py-3 text-sm text-center border transition-all duration-200 touch-target ${
                    selectedTime === slot
                      ? 'bg-vermillion text-soft-white border-vermillion'
                      : 'border-vermillion/20 text-charcoal hover:border-vermillion hover:text-vermillion'
                  }`}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Contact Details */}
      {step === 'details' && (
        <div>
          <button
            onClick={() => setStep('time')}
            className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors mb-6 touch-target"
          >
            ← Back
          </button>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal text-center mb-2">
            Your Details
          </h3>
          <p className="text-sm text-charcoal-light text-center mb-8">
            {t("book.step.details.desc")}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-vermillion-dark mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t("book.placeholder.name")}
                className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-vermillion-dark mb-1.5">
                Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder={t("book.placeholder.phone")}
                className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-vermillion-dark mb-1.5">
                Email <span className="text-warm-gray text-[9px]">(optional)</span>
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder={t("book.placeholder.email")}
                className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-vermillion-dark mb-1.5">
                Notes <span className="text-warm-gray text-[9px]">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("book.placeholder.notes")}
                rows={3}
                className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 transition-colors resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!clientName.trim() || !clientPhone.trim()) {
                setError(t('book.error.required'))
                return
              }
              setError('')
              setStep('confirm')
            }}
            className="mt-6 w-full bg-vermillion text-soft-white py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-vermillion-dark transition-colors touch-target"
          >
            Review Booking
          </button>
          {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 'confirm' && (
        <div>
          <button
            onClick={() => setStep('details')}
            className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors mb-6 touch-target"
          >
            ← Back
          </button>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal text-center mb-2">
            Confirm Your Booking
          </h3>
          <p className="text-sm text-charcoal-light text-center mb-8">
            {t("book.confirm.desc")}
          </p>

          <div className="border border-vermillion/15 bg-cream/30 p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-[0.15em] text-warm-gray">{t("book.label.service")}</span>
              <span className="text-sm text-charcoal text-right">{selectedService?.name}</span>
            </div>
            <div className="h-[1px] bg-vermillion/10" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-[0.15em] text-warm-gray">{t("book.label.date")}</span>
              <span className="text-sm text-charcoal text-right">
                {selectedDate && formatDisplayDate(selectedDate)}
              </span>
            </div>
            <div className="h-[1px] bg-vermillion/10" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-[0.15em] text-warm-gray">{t("book.label.time")}</span>
              <span className="text-sm text-charcoal text-right">
                {selectedTime && formatTime(selectedTime)} ({selectedService?.duration} min)
              </span>
            </div>
            <div className="h-[1px] bg-vermillion/10" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-[0.15em] text-warm-gray">Name</span>
              <span className="text-sm text-charcoal text-right">{clientName}</span>
            </div>
            <div className="h-[1px] bg-vermillion/10" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-[0.15em] text-warm-gray">Phone</span>
              <span className="text-sm text-charcoal text-right">{clientPhone}</span>
            </div>
            {clientEmail && (
              <>
                <div className="h-[1px] bg-vermillion/10" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-warm-gray">Email</span>
                  <span className="text-sm text-charcoal text-right">{clientEmail}</span>
                </div>
              </>
            )}
            {notes && (
              <>
                <div className="h-[1px] bg-vermillion/10" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-warm-gray">Notes</span>
                  <span className="text-sm text-charcoal text-right max-w-[200px]">{notes}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full bg-vermillion text-soft-white py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-vermillion-dark transition-colors touch-target disabled:opacity-50"
          >
            {submitting ? t('book.submitting') : t('book.confirm.btn')}
          </button>
          {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
        </div>
      )}

      {/* Step 6: Done */}
      {step === 'done' && bookingResult && (
        <div className="text-center py-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-jade/10 flex items-center justify-center mb-4">
            <span className="text-jade text-2xl">✓</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal mb-2">
            Booking Submitted!
          </h3>
          <p className="text-sm text-charcoal-light max-w-md mx-auto">
            {bookingResult.message}
          </p>
          <div className="mt-6 border border-vermillion/15 bg-cream/30 p-4 inline-block">
            <p className="text-[10px] uppercase tracking-[0.15em] text-warm-gray mb-1">
              {t("book.done.ref")}
            </p>
            <p className="text-sm font-medium text-charcoal">{bookingResult.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="mt-8">
            <button
              onClick={resetBooking}
              className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors touch-target"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
