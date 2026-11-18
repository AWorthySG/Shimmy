'use client'

import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

export default function LinksPage() {
  const { t } = useI18n()

  useEffect(() => {
    document.body.classList.add('links-page')
    return () => { document.body.classList.remove('links-page') }
  }, [])

  const links = [
    { key: 'links.book', href: '/brows' },
    { key: 'links.shop', href: '/nails/shop' },
    { key: 'links.services', href: '/brows/services' },
    { key: 'links.whatsapp', href: 'https://wa.me/6589308973' },
    { key: 'links.instagram', href: 'https://instagram.com/shimmyhands.shop' },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 py-16 bg-gradient-to-b from-cream-dark via-cream to-soft-white">
      <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-2" />
      <h1 className="text-2xl font-serif text-charcoal mb-6 tracking-wide">Shimmy</h1>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          className="btn btn-primary btn-lg w-full max-w-sm"
        >
          {t(l.key)}
        </a>
      ))}
      <div className="mx-auto h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/30 to-transparent mt-6" />
    </main>
  )
}
