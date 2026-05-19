'use client'

import { useState } from 'react'
import { MAX_ADVANCE_DAYS } from '@/lib/booking'

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export default function Calendar({
  selectedDate,
  onSelect,
  blockedDates,
  readOnly,
}: {
  selectedDate: string | null
  onSelect: (date: string) => void
  blockedDates?: string[]
  readOnly?: boolean
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
  const blockedSet = new Set(blockedDates ?? [])

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 text-charcoal-light hover:text-vermillion transition-colors touch-target"
        >
          &larr;
        </button>
        <span className="font-serif text-base text-charcoal">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="p-2 text-charcoal-light hover:text-vermillion transition-colors touch-target"
        >
          &rarr;
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
          const isBlocked = blockedSet.has(dateStr)
          const isDisabled = isPast || isTooFar || isSunday || (readOnly ? false : isBlocked)
          const isSelected = dateStr === selectedDate

          return (
            <button
              key={day}
              onClick={() => !isDisabled && !(readOnly && isPast) && onSelect(dateStr)}
              disabled={readOnly ? isPast || isTooFar : isDisabled}
              className={`aspect-square flex items-center justify-center text-sm transition-all duration-200 relative ${
                isSelected
                  ? 'bg-vermillion text-soft-white'
                  : isPast || isTooFar
                    ? 'text-warm-gray/30 cursor-not-allowed'
                    : isBlocked
                      ? 'text-warm-gray/50 bg-vermillion/5 cursor-pointer'
                      : isSunday && !readOnly
                        ? 'text-warm-gray/30 cursor-not-allowed'
                        : 'text-charcoal hover:bg-vermillion/10 hover:text-vermillion cursor-pointer'
              }`}
            >
              {day}
              {isBlocked && !isPast && !isTooFar && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vermillion/60" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
