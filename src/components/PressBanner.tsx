'use client'

import { useI18n } from '@/lib/i18n'

export default function PressBanner() {
  const { t } = useI18n()

  return (
    <section className="bg-cream/50 py-10 sm:py-14 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-warm-gray mb-6 sm:mb-8">
          {t("press.title")}
        </p>
        <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-24 h-12 sm:w-32 sm:h-14 bg-warm-gray/10 rounded text-warm-gray/30 text-lg select-none"
            >
              ✦
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
