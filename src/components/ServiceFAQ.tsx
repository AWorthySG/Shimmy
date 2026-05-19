'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

const serviceFaqMap: Record<string, { q: string; a: string }[]> = {
  embroidery: [
    { q: 'faq.svc.emb.1.q', a: 'faq.svc.emb.1.a' },
    { q: 'faq.svc.emb.2.q', a: 'faq.svc.emb.2.a' },
  ],
  microblading: [
    { q: 'faq.svc.mic.1.q', a: 'faq.svc.mic.1.a' },
    { q: 'faq.svc.mic.2.q', a: 'faq.svc.mic.2.a' },
  ],
  nano: [
    { q: 'faq.svc.nano.1.q', a: 'faq.svc.nano.1.a' },
    { q: 'faq.svc.nano.2.q', a: 'faq.svc.nano.2.a' },
  ],
  ombre: [
    { q: 'faq.svc.ombre.1.q', a: 'faq.svc.ombre.1.a' },
    { q: 'faq.svc.ombre.2.q', a: 'faq.svc.ombre.2.a' },
  ],
  shaping: [
    { q: 'faq.svc.shp.1.q', a: 'faq.svc.shp.1.a' },
    { q: 'faq.svc.shp.2.q', a: 'faq.svc.shp.2.a' },
  ],
  lip: [
    { q: 'faq.svc.lip.1.q', a: 'faq.svc.lip.1.a' },
    { q: 'faq.svc.lip.2.q', a: 'faq.svc.lip.2.a' },
  ],
}

const generalFaqKeys = [
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
          open ? 'max-h-96 pb-4 sm:pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-sm leading-relaxed text-charcoal-light">{a}</p>
      </div>
    </div>
  )
}

export default function ServiceFAQ({ serviceId }: { serviceId: string }) {
  const { t } = useI18n()
  const svcFaqs = serviceFaqMap[serviceId] ?? []
  const allFaqs = [...svcFaqs, ...generalFaqKeys]

  return (
    <div className="mt-4 sm:mt-6 border-t border-vermillion/10 pt-4 sm:pt-6">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-3">
        {t("faq.tag")}
      </p>
      <div>
        {allFaqs.map((faq) => (
          <FAQItem key={faq.q} q={t(faq.q)} a={t(faq.a)} />
        ))}
      </div>
    </div>
  )
}
