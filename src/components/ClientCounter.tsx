'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'

interface CounterStat {
  target: number
  labelKey: string
  suffix: string
}

const STATS: CounterStat[] = [
  { target: 500, labelKey: 'counter.clients', suffix: '+' },
  { target: 1200, labelKey: 'counter.brows', suffix: '+' },
  { target: 3000, labelKey: 'counter.nails', suffix: '+' },
]

function useCountUp(target: number, active: boolean, duration = 2000) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return

    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setValue(target)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [active, target, duration])

  return value
}

function CounterItem({ stat, active }: { stat: CounterStat; active: boolean }) {
  const { t } = useI18n()
  const value = useCountUp(stat.target, active)

  return (
    <div className="text-center px-4 py-6">
      <p className="font-serif text-3xl sm:text-4xl text-vermillion">
        {value.toLocaleString()}{stat.suffix}
      </p>
      <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.15em] text-charcoal-light">
        {t(stat.labelKey)}
      </p>
    </div>
  )
}

export default function ClientCounter() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActive(true)
      }
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
    })
    observer.observe(el)

    return () => observer.disconnect()
  }, [handleIntersect])

  return (
    <section ref={ref} className="bg-cream-dark py-12 sm:py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-vermillion/15">
        {STATS.map((stat) => (
          <CounterItem key={stat.labelKey} stat={stat} active={active} />
        ))}
      </div>
    </section>
  )
}
