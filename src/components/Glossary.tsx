'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

interface TooltipProps {
  term: ReactNode
  definition: string
}

export default function Glossary({ term, definition }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  // Close on outside click (for mobile tap-open)
  useEffect(() => {
    if (!visible) return
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [visible])

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
    >
      <span className="border-b border-dotted border-charcoal/40 cursor-help">
        {term}
      </span>
      {visible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max max-w-xs px-3 py-2 rounded bg-charcoal text-soft-white text-xs leading-relaxed shadow-lg pointer-events-none"
        >
          {definition}
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal" />
        </span>
      )}
    </span>
  )
}
