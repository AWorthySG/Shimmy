'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'How long does eyebrow embroidery last in Singapore?',
    a: 'Results typically last 12 to 18 months depending on skin type and aftercare. Oilier skin types may see earlier fading.',
  },
  {
    q: 'What is the difference between nano brows and microblading?',
    a: 'Microblading uses a manual blade. Nano brows use a digital nano-needle, producing finer strokes that suit all skin types, including oily skin where microblading may fade faster.',
  },
  {
    q: 'Is the eyebrow embroidery procedure painful?',
    a: 'Numbing cream is applied before the procedure. Most clients report minimal discomfort.',
  },
  {
    q: 'How long do Nails by Shimmyhands press-on nails last?',
    a: 'With proper application and care, most sets last 1 to 2 weeks.',
  },
  {
    q: 'Can I book a consultation without committing to a service?',
    a: 'Yes. We welcome a no-obligation consultation to discuss what suits you best.',
  },
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
  return (
    <div>
      {faqs.map((faq) => (
        <FAQItem key={faq.q} q={faq.q} a={faq.a} />
      ))}
    </div>
  )
}

export { faqs }
