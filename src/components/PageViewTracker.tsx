'use client'

import { usePageView, useWhatsAppClicks } from '@/lib/analytics'

export default function PageViewTracker() {
  usePageView()
  useWhatsAppClicks()
  return null
}
