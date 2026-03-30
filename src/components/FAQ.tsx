'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

const faqKeys = [
  { q: 'faq.1.q', a: 'faq.1.a' },
  { q: 'faq.2.q', a: 'faq.2.a' },
  { q: 'faq.3.q', a: 'faq.3.a' },
  { q: 'faq.4.q', a: 'faq.4.a' },
  { q: 'faq.5.q', a: 'faq.5.a' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-vermillion/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 sm:py-5 text-left touch-target"
      >
        <span className="text-sm sm:text-base font-medium text-charcoal pr-4">{q}</span>
        <span className={`text-vermillion text-lg shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-40 pb-4 sm:pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-sm leading-relaxed text-charcoal-light">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { t } = useI18n()

  return (
    <div>
      {faqKeys.map((faq) => (
        <FAQItem key={faq.q} q={t(faq.q)} a={t(faq.a)} />
      ))}
    </div>
  )
}

export { faqKeys }
