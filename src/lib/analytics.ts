'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { TrackedEvent } from './analytics-events'

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  const key = 'shimmy_session_id'
  try {
    let id = localStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    // Storage blocked (private mode, strict settings): count the visit without a session id.
    return 'no-storage'
  }
}

type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void

/**
 * Fire-and-forget analytics event tracker.
 */
export function trackEvent(event: TrackedEvent, metadata?: Record<string, string | number>) {
  const page = typeof window !== 'undefined' ? window.location.pathname : undefined

  // Also send to Google Analytics when it is loaded (NEXT_PUBLIC_GA_ID set).
  // GA records page views itself, so only forward the other events.
  if (event !== 'page_view' && typeof window !== 'undefined') {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    if (typeof gtag === 'function') gtag('event', event, metadata)
  }

  // Fire-and-forget, no await
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      page,
      metadata,
      session_id: getSessionId(),
    }),
  }).catch(() => {
    // Silently ignore tracking failures
  })
}

/**
 * Hook that tracks a page_view event once on mount.
 */
export function usePageView() {
  const pathname = usePathname()

  useEffect(() => {
    trackEvent('page_view', { pathname })
  }, [pathname])
}

/**
 * Records a whatsapp_click whenever a visitor follows any wa.me link, so
 * WhatsApp enquiries can be counted alongside bookings.
 */
export function useWhatsAppClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href*="wa.me/"]')
      if (link) trackEvent('whatsapp_click', { from: window.location.pathname })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
}
