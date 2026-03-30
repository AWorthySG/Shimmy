'use client'

import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    // TODO: Connect to email service provider (Mailchimp, Klaviyo, or Resend)
    console.log('Email submitted:', email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm text-jade font-medium">Thank you — we will be in touch!</p>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          className="border border-vermillion/20 bg-soft-white px-4 py-2.5 flex-1 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-vermillion/50 transition-colors"
        />
        <button
          onClick={handleSubmit}
          className="btn-magnetic shine-on-hover bg-vermillion text-soft-white px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-vermillion-dark transition-colors touch-target"
        >
          Get $10 Off
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
