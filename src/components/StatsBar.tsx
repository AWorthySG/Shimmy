'use client'

import { AnimateOnScroll } from '@/components/animate-on-scroll'
import { useI18n } from '@/lib/i18n'

// TODO: Update these with real, verified figures from the studio owner
const stats = [
  { value: '200+', key: 'stats.brows' },
  { value: '5.0', key: 'stats.rating' },
  { value: '2', key: 'stats.years' },
]

export default function StatsBar() {
  const { t } = useI18n()

  return (
    <AnimateOnScroll animation="fade-up">
      <div className="grid grid-cols-3 gap-4 py-10 sm:py-12 border-y border-vermillion/15 mx-auto max-w-4xl">
        {stats.map((s) => (
          <div key={s.key} className="text-center">
            <p className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">{s.value}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-warm-gray mt-1">{t(s.key)}</p>
          </div>
        ))}
      </div>
    </AnimateOnScroll>
  )
}
