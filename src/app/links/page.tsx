'use client'

import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

export default function LinksPage() {
  const { t } = useI18n()

  // Hide navbar and footer on this page (link-in-bio should be standalone)
  useEffect(() => {
    document.body.classList.add('links-page')
    return () => { document.body.classList.remove('links-page') }
  }, [])

  const links = [
    { key: 'links.book', href: '/brows', colour: 'bg-vermillion hover:bg-vermillion-dark' },
    { key: 'links.shop', href: '/nails/shop', colour: 'bg-vermillion hover:bg-vermillion-dark' },
    { key: 'links.services', href: '/brows/services', colour: 'bg-charcoal/80 hover:bg-charcoal' },
    { key: 'links.whatsapp', href: 'https://wa.me/6589308973', colour: 'bg-jade hover:bg-jade/90' },
    { key: 'links.instagram', href: 'https://instagram.com/shimmyhands.shop', colour: 'bg-vermillion-dark hover:bg-vermillion' },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 py-16 bg-gradient-to-b from-cream-dark via-cream to-soft-white">
      <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-2" />
      <h1 className="text-2xl font-serif text-charcoal mb-6 tracking-wide">Shimmy</h1>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          className={`${l.colour} text-soft-white text-center w-full max-w-sm py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors touch-target`}
        >
          {t(l.key)}
        </a>
      ))}
      <div className="mx-auto h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/30 to-transparent mt-6" />
    </main>
  )
}
