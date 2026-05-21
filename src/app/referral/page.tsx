'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'

export default function ReferralPage() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams.get('code')

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  // Referral welcome state
  const [referrer, setReferrer] = useState('')
  const [lookupDone, setLookupDone] = useState(false)

  // Look up referral code from URL
  useEffect(() => {
    if (!codeFromUrl) return
    async function lookupCode() {
      try {
        const res = await fetch(`/api/referral?code=${encodeURIComponent(codeFromUrl!)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.referrer) setReferrer(data.referrer)
        }
      } catch {
        // ignore
      }
      setLookupDone(true)
    }
    lookupCode()
  }, [codeFromUrl])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedCode(data.code)
        setGeneratedLink(`https://shimmyhands.com/referral?code=${data.code}`)
      } else {
        setError(data.error || t('referral.error'))
      }
    } catch {
      setError(t('referral.error'))
    }
    setLoading(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const whatsappShareUrl = generatedLink
    ? `https://wa.me/?text=${encodeURIComponent(t('referral.share.message').replace('{link}', generatedLink))}`
    : ''

  return (
    <>
      {/* Welcome banner for referred visitors */}
      {codeFromUrl && lookupDone && referrer && (
        <div className="bg-jade/10 border-b border-jade/20 px-4 py-4 text-center">
          <p className="text-sm text-charcoal">
            {t('referral.welcome.prefix')}{' '}
            <span className="font-medium">{referrer}</span>
            {t('referral.welcome.suffix')}{' '}
            <span className="font-semibold text-jade">{codeFromUrl}</span>{' '}
            {t('referral.welcome.discount')}
          </p>
        </div>
      )}

      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t('referral.tag')}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl">
            {t('referral.title')}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-warm-gray max-w-xl mx-auto leading-relaxed">
            {t('referral.desc')}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl sm:text-3xl text-charcoal mb-10">
            {t('referral.how.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: t('referral.step1.title'), desc: t('referral.step1.desc') },
              { step: '2', title: t('referral.step2.title'), desc: t('referral.step2.desc') },
              { step: '3', title: t('referral.step3.title'), desc: t('referral.step3.desc') },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto w-12 h-12 border-2 border-vermillion/30 flex items-center justify-center mb-4">
                  <span className="font-serif text-xl text-vermillion">{step}</span>
                </div>
                <h3 className="font-serif text-lg text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-warm-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generate code form */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          {!generatedCode ? (
            <div className="border border-vermillion/15 bg-soft-white p-6 sm:p-8">
              <h2 className="font-serif text-xl text-charcoal text-center mb-6">
                {t('referral.form.title')}
              </h2>
              <form onSubmit={handleGenerate}>
                <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                  {t('referral.form.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('referral.form.name.placeholder')}
                  required
                  className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50"
                />
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="mt-4 w-full bg-vermillion text-soft-white py-3 text-xs uppercase tracking-[0.2em] hover:bg-vermillion-dark transition-colors disabled:opacity-50"
                >
                  {loading ? t('referral.form.loading') : t('referral.form.submit')}
                </button>
              </form>
            </div>
          ) : (
            <div className="border border-vermillion/15 bg-soft-white p-6 sm:p-8 text-center">
              <h2 className="font-serif text-xl text-charcoal mb-2">
                {t('referral.success.title')}
              </h2>
              <p className="text-sm text-warm-gray mb-6">{t('referral.success.desc')}</p>

              {/* Code display */}
              <div className="bg-cream border border-vermillion/20 px-6 py-4 mb-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-vermillion-dark mb-1">
                  {t('referral.success.code')}
                </p>
                <p className="font-serif text-2xl sm:text-3xl text-charcoal tracking-wider">
                  {generatedCode}
                </p>
              </div>

              {/* Shareable link */}
              <div className="bg-cream/50 border border-vermillion/10 px-4 py-3 mb-4 break-all">
                <p className="text-xs text-warm-gray">{generatedLink}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 border border-vermillion/20 text-charcoal py-3 text-xs uppercase tracking-[0.2em] hover:border-vermillion/50 transition-colors"
                >
                  {copied ? t('referral.copied') : t('referral.copy')}
                </button>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-jade text-soft-white py-3 text-xs uppercase tracking-[0.2em] hover:bg-jade/80 transition-colors text-center"
                >
                  {t('referral.share.whatsapp')}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
