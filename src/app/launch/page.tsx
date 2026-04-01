'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

function getTimeLeft(target: Date) {
  const now = new Date().getTime()
  const diff = target.getTime() - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

// Demo: 30 days from now
const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

export default function LaunchPage() {
  const { t } = useI18n()
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(LAUNCH_DATE))
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(LAUNCH_DATE))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
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
      // Non-critical
    }
    setSubmitted(true)
  }

  const timerBlocks: { value: number; label: string }[] = [
    { value: timeLeft.days, label: t('launch.days') },
    { value: timeLeft.hours, label: t('launch.hours') },
    { value: timeLeft.minutes, label: t('launch.minutes') },
    { value: timeLeft.seconds, label: t('launch.seconds') },
  ]

  return (
    <>
      {/* ─── Hero + Countdown ─── */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-charcoal px-4 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-vermillion mb-4">
          {t('launch.tag')}
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-gold mb-4">
          {t('launch.title')}
        </h1>
        <p className="max-w-md text-sm text-warm-gray/70 mb-10 leading-relaxed">
          {t('launch.desc')}
        </p>

        {/* Countdown Timer */}
        <div className="flex gap-4 sm:gap-8 mb-12">
          {timerBlocks.map((block) => (
            <div key={block.label} className="flex flex-col items-center">
              <span className="font-serif text-4xl sm:text-6xl text-gold tabular-nums">
                {String(block.value).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-warm-gray/50">
                {block.label}
              </span>
            </div>
          ))}
        </div>

        {/* Email Waitlist */}
        {submitted ? (
          <p className="text-sm text-jade font-medium">
            You&rsquo;re on the list!
          </p>
        ) : (
          <div className="w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                className="border border-warm-gray/20 bg-charcoal-light px-4 py-2.5 flex-1 text-sm text-soft-white placeholder:text-warm-gray/40 focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button
                onClick={handleSubmit}
                className="bg-vermillion text-soft-white px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-vermillion-dark transition-colors"
              >
                {t('launch.notify')}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>
        )}
      </section>

      {/* ─── First Look Gallery ─── */}
      <section className="bg-cream px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-vermillion mb-2">
            {t('launch.gallery')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative aspect-[4/5] bg-gradient-to-br from-cream-dark/60 via-cream to-vermillion/5 flex items-center justify-center"
              >
                <div className="text-center px-4">
                  <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-2" />
                  <p className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/40">
                    Coming Soon
                  </p>
                  <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WhatsApp CTA ─── */}
      <section className="bg-soft-white px-4 py-16 text-center">
        <a
          href="https://wa.me/6589308973"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-jade text-soft-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-jade/90 transition-colors"
        >
          {t('launch.wa')}
        </a>
      </section>
    </>
  )
}
