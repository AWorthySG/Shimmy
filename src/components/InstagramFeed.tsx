'use client'

import { useI18n } from '@/lib/i18n'

const FEED_POSTS = [
  {
    labelKey: 'instagram.post.nano',
    gradient: 'from-vermillion/30 via-cream-dark to-gold/20',
  },
  {
    labelKey: 'instagram.post.pressons',
    gradient: 'from-jade/20 via-cream to-vermillion/15',
  },
  {
    labelKey: 'instagram.post.ombre',
    gradient: 'from-gold/25 via-cream-dark to-jade/15',
  },
  {
    labelKey: 'instagram.post.studio',
    gradient: 'from-charcoal/15 via-cream to-vermillion/20',
  },
  {
    labelKey: 'instagram.post.nailart',
    gradient: 'from-vermillion/20 via-gold/15 to-cream-dark',
  },
  {
    labelKey: 'instagram.post.bts',
    gradient: 'from-jade/15 via-cream-dark to-gold/25',
  },
]

function InstagramIcon() {
  return (
    <svg
      className="w-8 h-8 text-soft-white drop-shadow-md"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export default function InstagramFeed() {
  const { t } = useI18n()

  return (
    <section className="bg-soft-white py-12 sm:py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-[2px] w-[50px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
            {t('instagram.tag')}
          </p>
          <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal">
            {t('instagram.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {FEED_POSTS.map((post, i) => (
            <a
              key={i}
              href="https://instagram.com/shimmyhands.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden border border-vermillion/10"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`}
              />
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
                backgroundSize: '16px 16px',
              }} />
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <InstagramIcon />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-charcoal/60 px-2 text-center">
                  {t(post.labelKey)}
                </span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
            </a>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://instagram.com/shimmyhands.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors touch-target py-2"
          >
            {t('instagram.follow')} →
          </a>
        </div>
      </div>
    </section>
  )
}
