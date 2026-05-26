'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

interface LoyaltyVisit {
  id?: string
  phone: string
  client_name: string
  service: string | null
  visit_date: string
  notes: string | null
  created_at: string
}

const REWARD_TIERS = [
  { visits: 3, reward: 'S$15 off' },
  { visits: 6, reward: 'S$30 off' },
  { visits: 9, reward: 'Free touch-up' },
]

export default function LoyaltyPage() {
  const { t } = useI18n()

  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    visits: LoyaltyVisit[]
    total: number
    nextReward: string
    visitsToNext: number
    nextMilestone: number
  } | null>(null)
  const [searched, setSearched] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return

    // Normalise phone: prepend +65 if not present
    let normalised = phone.replace(/[\s\-()]/g, '')
    if (!normalised.startsWith('+')) {
      normalised = '+65' + normalised
    }

    setLoading(true)
    setError('')
    setResult(null)
    setSearched(false)
    try {
      const res = await fetch(`/api/loyalty?phone=${encodeURIComponent(normalised)}`)
      if (res.ok) {
        const data = await res.json()
        setResult({
          visits: data.visits,
          total: data.total,
          nextReward: data.nextReward,
          visitsToNext: data.visitsToNext,
          nextMilestone: data.nextMilestone,
        })
      } else {
        const data = await res.json()
        setError(data.error || t('loyalty.error'))
      }
    } catch {
      setError(t('loyalty.error'))
    }
    setSearched(true)
    setLoading(false)
  }

  // Progress within current 3-visit cycle
  const progressInCycle = result ? (result.total % 3) : 0
  const progressPercent = result ? ((progressInCycle / 3) * 100) : 0

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t('loyalty.tag')}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl">
            {t('loyalty.title')}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-warm-gray max-w-xl mx-auto leading-relaxed">
            {t('loyalty.desc')}
          </p>
        </div>
      </section>

      {/* Reward tiers */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl sm:text-3xl text-charcoal mb-10">
            {t('loyalty.tiers.title')}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {REWARD_TIERS.map(({ visits }, i) => (
              <div key={visits} className="border border-vermillion/15 bg-cream/30 p-6 text-center">
                <div className="mx-auto w-12 h-12 border-2 border-gold/40 flex items-center justify-center mb-4">
                  <span className="font-serif text-xl text-gold">{visits}</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-vermillion-dark mb-2">
                  {visits} {t('loyalty.tier.visits')}
                </p>
                <p className="font-serif text-lg text-charcoal">
                  {i === 0 ? t('loyalty.tier1.reward') : i === 1 ? t('loyalty.tier2.reward') : t('loyalty.tier3.reward')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phone lookup */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          <div className="border border-vermillion/15 bg-soft-white p-6 sm:p-8">
            <h2 className="font-serif text-xl text-charcoal text-center mb-6">
              {t('loyalty.check.title')}
            </h2>
            <form onSubmit={handleLookup}>
              <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                {t('loyalty.check.phone.label')}
              </label>
              <div className="flex gap-2">
                <span className="flex items-center border border-vermillion/15 bg-cream/50 px-3 text-sm text-charcoal-light">
                  +65
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('loyalty.check.phone.placeholder')}
                  required
                  className="flex-1 border border-vermillion/15 bg-cream/50 py-3 pl-4 pr-4 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-vermillion/40 focus:outline-none"
                />
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="mt-4 w-full bg-vermillion text-soft-white px-6 py-3 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-vermillion-dark disabled:opacity-50"
              >
                {loading ? t('loyalty.check.loading') : t('loyalty.check.submit')}
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && result && result.total === 0 && (
            <div className="mt-6 border border-vermillion/10 bg-soft-white p-6 text-center">
              <p className="text-sm text-warm-gray">{t('loyalty.no.visits')}</p>
              <a
                href="https://wa.me/6589308973"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-vermillion text-soft-white px-6 py-3 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-vermillion-dark"
              >
                {t('loyalty.book.first')}
              </a>
            </div>
          )}

          {result && result.total > 0 && (
            <div className="mt-6 space-y-6">
              {/* Stats */}
              <div className="border border-vermillion/15 bg-soft-white p-6">
                <div className="text-center mb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-vermillion-dark mb-1">
                    {t('loyalty.total.visits')}
                  </p>
                  <p className="font-serif text-4xl text-charcoal">{result.total}</p>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.15em] text-warm-gray mb-2">
                    <span>{t('loyalty.progress.current')}</span>
                    <span>
                      {result.visitsToNext} {t('loyalty.progress.to.next')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-cream border border-vermillion/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-vermillion to-gold transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-warm-gray mt-2 text-center">
                    {t('loyalty.next.reward')}: <span className="text-charcoal font-medium">{result.nextReward}</span>
                  </p>
                </div>
              </div>

              {/* Visit history */}
              <div className="border border-vermillion/15 bg-soft-white p-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-4">
                  {t('loyalty.history.title')}
                </h3>
                <div className="space-y-3">
                  {result.visits.map((visit, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 border-b border-vermillion/8 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm text-charcoal">{visit.client_name}</p>
                        {visit.service && (
                          <span className="text-[10px] uppercase tracking-[0.15em] text-vermillion-dark border border-vermillion/20 bg-vermillion/5 px-2 py-0.5 mt-1 inline-block">
                            {visit.service}
                          </span>
                        )}
                        {visit.notes && <p className="text-xs text-charcoal-light italic mt-1">{visit.notes}</p>}
                      </div>
                      <p className="text-xs text-warm-gray shrink-0">
                        {new Date(visit.visit_date).toLocaleDateString('en-SG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
