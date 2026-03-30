'use client'

import { useEffect } from 'react'

export default function BookingWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget w-full"
      // TODO: Replace with your actual Calendly URL
      data-url="https://calendly.com/YOUR_ACCOUNT/brow-consultation"
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}
