'use client'

import { trackEvent } from '@/lib/analytics'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

export default function EmailCapture() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('email.error'))
      return
    }
    setError('')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Non-critical: show success anyway
    }
    trackEvent('email_signup')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm text-jade font-medium">{t('email.success')}</p>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder={t('email.placeholder')}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          className="field flex-1"
        />
        <button
          onClick={handleSubmit}
          className="btn btn-primary btn-sm btn-magnetic shine-on-hover touch-target"
        >
          {t('email.cta')}
        </button>
      </div>
      {error && <p className="text-xs text-error mt-2">{error}</p>}
    </div>
  )
}
