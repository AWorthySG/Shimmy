'use client'

import { usePageView } from '@/lib/analytics'

export default function PageViewTracker() {
  usePageView()
  return null
}
