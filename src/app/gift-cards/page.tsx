'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

const PRESET_VALUES = [25, 50, 100]

export default function GiftCardsPage() {
  const { t } = useI18n()

  // Purchase form state
  const [selectedValue, setSelectedValue] = useState<number>(50)
  const [customValue, setCustomValue] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [purchaserName, setPurchaserName] = useState('')
  const [purchaserEmail, setPurchaserEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [purchasedCode, setPurchasedCode] = useState('')
  const [purchasedValue, setPurchasedValue] = useState(0)
  const [purchasedRecipient, setPurchasedRecipient] = useState('')

  // Balance check state
  const [checkCode, setCheckCode] = useState('')
  const [checkLoading, setCheckLoading] = useState(false)
  const [checkResult, setCheckResult] = useState<{
    balance: number
    is_active: boolean
    recipient_name: string
  } | null>(null)
  const [checkError, setCheckError] = useState('')

  const effectiveValue = isCustom ? Number(customValue) : selectedValue

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!effectiveValue || effectiveValue <= 0) return
    if (!purchaserName.trim() || !purchaserEmail.trim() || !recipientName.trim()) return

    setPurchaseLoading(true)
    setPurchaseError('')
    try {
      const res = await fetch('/api/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: effectiveValue,
          purchaser_name: purchaserName.trim(),
          purchaser_email: purchaserEmail.trim(),
          recipient_name: recipientName.trim(),
          recipient_email: recipientEmail.trim() || undefined,
          message: message.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPurchasedCode(data.code)
        setPurchasedValue(effectiveValue)
        setPurchasedRecipient(recipientName.trim())
      } else {
        setPurchaseError(data.error || t('gift.purchase.error'))
      }
    } catch {
      setPurchaseError(t('gift.purchase.error'))
    }
    setPurchaseLoading(false)
  }

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkCode.trim()) return
    setCheckLoading(true)
    setCheckError('')
    setCheckResult(null)
    try {
      const res = await fetch(`/api/gift-cards?code=${encodeURIComponent(checkCode.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setCheckResult({
          balance: data.balance,
          is_active: data.is_active,
          recipient_name: data.recipient_name,
        })
      } else {
        const data = await res.json()
        setCheckError(data.error || t('gift.check.notfound'))
      }
    } catch {
      setCheckError(t('gift.check.error'))
    }
    setCheckLoading(false)
  }

  const whatsappGiftUrl = purchasedCode
    ? `https://wa.me/?text=${encodeURIComponent(
        t('gift.share.message')
          .replace('{name}', purchasedRecipient)
          .replace('{code}', purchasedCode)
          .replace('{value}', `S$${purchasedValue}`)
      )}`
    : ''

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t('gift.tag')}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl">
            {t('gift.title')}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-warm-gray max-w-xl mx-auto leading-relaxed">
            {t('gift.desc')}
          </p>
        </div>
      </section>

      {/* Gift card visual */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          {/* CSS-only gift card */}
          <div className="relative bg-gradient-to-br from-charcoal to-charcoal-light p-6 sm:p-8 aspect-[1.6/1] flex flex-col justify-between overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-vermillion/40" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-vermillion/40" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-vermillion/40" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-vermillion/40" />

            <div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-vermillion/80">
                {t('gift.card.label')}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-soft-white mt-1 tracking-wide">Shimmy</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-soft-white/50">{t('gift.card.value')}</p>
              <p className="font-serif text-3xl sm:text-4xl text-gold">S${effectiveValue || '—'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase form */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          {!purchasedCode ? (
            <div className="border border-vermillion/15 bg-soft-white p-6 sm:p-8">
              <h2 className="font-serif text-xl text-charcoal text-center mb-6">
                {t('gift.purchase.title')}
              </h2>
              <form onSubmit={handlePurchase}>
                {/* Value selector */}
                <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                  {t('gift.value.label')}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {PRESET_VALUES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setSelectedValue(v); setIsCustom(false) }}
                      className={`py-2.5 text-xs uppercase tracking-[0.1em] border transition-colors ${
                        !isCustom && selectedValue === v
                          ? 'border-vermillion bg-vermillion/5 text-vermillion'
                          : 'border-vermillion/20 text-charcoal hover:border-vermillion/40'
                      }`}
                    >
                      S${v}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`py-2.5 text-xs uppercase tracking-[0.1em] border transition-colors ${
                      isCustom
                        ? 'border-vermillion bg-vermillion/5 text-vermillion'
                        : 'border-vermillion/20 text-charcoal hover:border-vermillion/40'
                    }`}
                  >
                    {t('gift.value.custom')}
                  </button>
                </div>
                {isCustom && (
                  <input
                    type="number"
                    min="1"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="S$"
                    className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 mb-4"
                  />
                )}

                {/* Your name */}
                <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2 mt-2">
                  {t('gift.form.your.name')}
                </label>
                <input
                  type="text"
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  placeholder={t('gift.form.your.name.placeholder')}
                  required
                  className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 mb-4"
                />

                {/* Your email */}
                <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                  {t('gift.form.your.email')}
                </label>
                <input
                  type="email"
                  value={purchaserEmail}
                  onChange={(e) => setPurchaserEmail(e.target.value)}
                  placeholder={t('gift.form.your.email.placeholder')}
                  required
                  className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 mb-4"
                />

                {/* Recipient name */}
                <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                  {t('gift.form.recipient.name')}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder={t('gift.form.recipient.name.placeholder')}
                  required
                  className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 mb-4"
                />

                {/* Recipient email (optional) */}
                <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                  {t('gift.form.recipient.email')}{' '}
                  <span className="text-warm-gray/60 normal-case tracking-normal">({t('gift.form.optional')})</span>
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder={t('gift.form.recipient.email.placeholder')}
                  className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 mb-4"
                />

                {/* Personal message (optional) */}
                <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                  {t('gift.form.message')}{' '}
                  <span className="text-warm-gray/60 normal-case tracking-normal">({t('gift.form.optional')})</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('gift.form.message.placeholder')}
                  rows={3}
                  className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 mb-4 resize-none"
                />

                {purchaseError && <p className="text-xs text-red-500 mb-3">{purchaseError}</p>}

                <button
                  type="submit"
                  disabled={purchaseLoading || !effectiveValue || effectiveValue <= 0}
                  className="w-full bg-vermillion text-soft-white py-3 text-xs uppercase tracking-[0.2em] hover:bg-vermillion-dark transition-colors disabled:opacity-50"
                >
                  {purchaseLoading ? t('gift.purchase.loading') : t('gift.purchase.submit')}
                </button>
              </form>
            </div>
          ) : (
            <div className="border border-vermillion/15 bg-soft-white p-6 sm:p-8 text-center">
              <h2 className="font-serif text-xl text-charcoal mb-2">
                {t('gift.purchase.success.title')}
              </h2>
              <p className="text-sm text-warm-gray mb-6">{t('gift.purchase.success.desc')}</p>

              <div className="bg-cream border border-vermillion/20 px-6 py-4 mb-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-vermillion-dark mb-1">
                  {t('gift.purchase.success.code')}
                </p>
                <p className="font-serif text-2xl sm:text-3xl text-charcoal tracking-wider">
                  {purchasedCode}
                </p>
                <p className="text-sm text-warm-gray mt-2">
                  {t('gift.card.value')}: <span className="text-charcoal font-medium">S${purchasedValue}</span>
                </p>
              </div>

              <a
                href={whatsappGiftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-jade text-soft-white py-3 text-xs uppercase tracking-[0.2em] hover:bg-jade/80 transition-colors text-center"
              >
                {t('gift.share.whatsapp')}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Check balance */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          <div className="border border-vermillion/15 bg-cream/30 p-6 sm:p-8">
            <h2 className="font-serif text-xl text-charcoal text-center mb-6">
              {t('gift.check.title')}
            </h2>
            <form onSubmit={handleCheckBalance}>
              <label className="block text-xs uppercase tracking-[0.15em] text-vermillion-dark mb-2">
                {t('gift.check.code.label')}
              </label>
              <input
                type="text"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                placeholder={t('gift.check.code.placeholder')}
                required
                className="w-full border border-vermillion/20 bg-soft-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 uppercase tracking-widest"
              />
              {checkError && <p className="text-xs text-red-500 mt-2">{checkError}</p>}
              <button
                type="submit"
                disabled={checkLoading || !checkCode.trim()}
                className="mt-4 w-full bg-charcoal text-soft-white py-3 text-xs uppercase tracking-[0.2em] hover:bg-charcoal/80 transition-colors disabled:opacity-50"
              >
                {checkLoading ? t('gift.check.loading') : t('gift.check.submit')}
              </button>
            </form>

            {checkResult && (
              <div className="mt-6 border-t border-vermillion/10 pt-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-vermillion-dark mb-1">
                  {t('gift.check.balance')}
                </p>
                <p className="font-serif text-3xl text-charcoal">
                  S${checkResult.balance.toFixed(2)}
                </p>
                <p className="text-sm text-warm-gray mt-2">
                  {t('gift.check.for')}{' '}
                  <span className="text-charcoal">{checkResult.recipient_name}</span>
                </p>
                <span
                  className={`inline-block mt-2 text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border ${
                    checkResult.is_active
                      ? 'text-jade border-jade/20 bg-jade/5'
                      : 'text-red-500 border-red-200 bg-red-50'
                  }`}
                >
                  {checkResult.is_active ? t('gift.check.active') : t('gift.check.redeemed')}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
