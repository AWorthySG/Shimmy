'use client'

import { useI18n } from '@/lib/i18n'

interface StatConfig {
  target: number
  decimals: number
  suffix: string
  labelKey: string
}

const stats: StatConfig[] = [
  { target: 200, decimals: 0, suffix: '+', labelKey: 'stats.brows' },
  { target: 5.0, decimals: 1, suffix: '', labelKey: 'stats.rating' },
  { target: 2, decimals: 0, suffix: '', labelKey: 'stats.years' },
]

/** Static figures: the real numbers are in the HTML, so search engines and every visitor see them. */
export default function StatsBar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { t } = useI18n()
  const light = tone === 'light'

  return (
    <dl className={`grid grid-cols-3 gap-4 py-8 sm:py-10 border-y mx-auto max-w-4xl ${light ? 'border-on-scrim/25' : 'border-vermillion/15'}`}>
      {stats.map((s) => (
        <div key={s.labelKey} className="flex flex-col-reverse justify-end text-center">
          <dt className={`mt-1 text-[10px] sm:text-xs uppercase tracking-button ${light ? 'text-on-scrim/75' : 'text-warm-gray'}`}>{t(s.labelKey)}</dt>
          <dd className={`font-serif text-3xl sm:text-4xl ${light ? 'text-on-scrim' : 'text-charcoal'}`}>
            {s.target.toFixed(s.decimals)}
            {s.suffix}
          </dd>
        </div>
      ))}
    </dl>
  )
}
