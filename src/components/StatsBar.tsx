'use client'

import { AnimateOnScroll } from '@/components/animate-on-scroll'

// TODO: Update these with real, verified figures from the studio owner
const stats = [
  { value: '200+', label: 'Brows Shaped' },
  { value: '5.0', label: 'Average Rating' },
  { value: '2', label: 'Years in Singapore' },
]

export default function StatsBar() {
  return (
    <AnimateOnScroll animation="fade-up">
      <div className="grid grid-cols-3 gap-4 py-10 sm:py-12 border-y border-vermillion/15 mx-auto max-w-4xl">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">{s.value}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-warm-gray mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </AnimateOnScroll>
  )
}
