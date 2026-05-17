'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface StatConfig {
  target: number
  decimals: number
  suffix: string
  label: string
}

const stats: StatConfig[] = [
  { target: 200, decimals: 0, suffix: '+', label: 'Brows Shaped' },
  { target: 5.0, decimals: 1, suffix: '', label: 'Average Rating' },
  { target: 2, decimals: 0, suffix: '', label: 'Years in Singapore' },
]

function easeOutQuad(t: number): number {
  return t * (2 - t)
}

function AnimatedNumber({ target, decimals, suffix, run }: { target: number; decimals: number; suffix: string; run: boolean }) {
  const [display, setDisplay] = useState(decimals > 0 ? '0.0' : '0')
  const rafRef = useRef<number>(0)

  const animate = useCallback(() => {
    const duration = 1500
    const start = performance.now()

    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuad(progress)
      const current = eased * target

      if (decimals > 0) {
        setDisplay(current.toFixed(decimals))
      } else {
        setDisplay(Math.round(current).toString())
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        if (decimals > 0) {
          setDisplay(target.toFixed(decimals) + suffix)
        } else {
          setDisplay(target.toString() + suffix)
        }
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [target, decimals, suffix])

  useEffect(() => {
    if (run) {
      animate()
    }
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [run, animate])

  return <>{display}</>
}

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasAnimated])

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-4 py-10 sm:py-12 border-y border-vermillion/15 mx-auto max-w-4xl">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
            <AnimatedNumber target={s.target} decimals={s.decimals} suffix={s.suffix} run={hasAnimated} />
          </p>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-warm-gray mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
