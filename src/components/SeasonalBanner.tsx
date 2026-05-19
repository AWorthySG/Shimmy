'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

type Season = 'cny' | 'spring' | 'summer' | 'fall' | 'holiday'

function getSeason(): Season {
  const month = new Date().getMonth() + 1 // 1-12
  if (month <= 2) return 'cny'
  if (month <= 5) return 'spring'
  if (month <= 8) return 'summer'
  if (month <= 10) return 'fall'
  return 'holiday'
}

const STORAGE_KEY = 'shimmy_seasonal_dismissed'

export default function SeasonalBanner() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const season = getSeason()

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (dismissed !== season) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [season])

  function handleDismiss() {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, season)
    } catch {
      // localStorage unavailable
    }
  }

  if (!visible) return null

  return (
    <div className="bg-cream-dark text-vermillion px-4 sm:px-6 py-3 sm:py-4">
      <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <span className="text-vermillion/40 text-xs shrink-0">✦</span>
          <p className="text-xs sm:text-sm font-medium truncate">
            {t(`seasonal.${season}`)}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/6589308973"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold text-vermillion hover:text-vermillion-dark transition-colors whitespace-nowrap"
          >
            {t(`seasonal.cta.${season}`)}
          </a>
          <button
            onClick={handleDismiss}
            className="text-charcoal-light hover:text-charcoal transition-colors p-1 touch-target"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
