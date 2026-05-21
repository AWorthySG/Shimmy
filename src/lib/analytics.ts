'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  const key = 'shimmy_session_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

/**
 * Fire-and-forget analytics event tracker.
 */
export function trackEvent(event: string, metadata?: Record<string, unknown>) {
  const page = typeof window !== 'undefined' ? window.location.pathname : undefined

  // Fire-and-forget — no await
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
