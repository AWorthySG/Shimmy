'use client'

import { useEffect } from 'react'

export default function LinksPage() {
  // Hide navbar and footer on this page (link-in-bio should be standalone)
  useEffect(() => {
    document.body.classList.add('links-page')
    return () => { document.body.classList.remove('links-page') }
  }, [])

  const links = [
    { label: 'Book Brow Appointment', href: '/brows', colour: 'bg-vermillion hover:bg-vermillion-dark' },
    { label: 'Shop Press-On Nails', href: '/nails/shop', colour: 'bg-vermillion hover:bg-vermillion-dark' },
    { label: 'View All Services', href: '/brows/services', colour: 'bg-charcoal/80 hover:bg-charcoal' },
    // TODO: Replace with real WhatsApp number
    { label: 'WhatsApp Us', href: 'https://wa.me/6512345678', colour: 'bg-jade hover:bg-jade/90' },
    { label: 'Follow on Instagram', href: 'https://instagram.com/shimmyhands.shop', colour: 'bg-vermillion-dark hover:bg-vermillion' },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 py-16 bg-gradient-to-b from-cream-dark via-cream to-soft-white">
      <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-2" />
      <h1 className="text-2xl font-serif text-charcoal mb-6 tracking-wide">Shimmy</h1>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className={`${l.colour} text-soft-white text-center w-full max-w-sm py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors touch-target`}
        >
          {l.label}
        </a>
      ))}
      <div className="mx-auto h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/30 to-transparent mt-6" />
    </main>
  )
}
