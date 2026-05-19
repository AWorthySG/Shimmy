'use client'

import { useI18n } from '@/lib/i18n'

const services = [
  {
    titleKey: 'svc.embroidery.title',
    durationKey: 'svc.embroidery.duration',
    priceKey: 'svc.embroidery.price',
    longevityKey: 'compare.longevity.embroidery',
    skinKey: 'compare.skin.normaldry',
    popular: false,
  },
  {
    titleKey: 'svc.microblading.title',
    durationKey: 'svc.microblading.duration',
    priceKey: 'svc.microblading.price',
    longevityKey: 'compare.longevity.microblading',
    skinKey: 'compare.skin.normaldry',
    popular: false,
  },
  {
    titleKey: 'svc.nano.title',
    durationKey: 'svc.nano.duration',
    priceKey: 'svc.nano.price',
    longevityKey: 'compare.longevity.nano',
    skinKey: 'compare.skin.all',
    popular: true,
  },
  {
    titleKey: 'svc.ombre.title',
    durationKey: 'svc.ombre.duration',
    priceKey: 'svc.ombre.price',
    longevityKey: 'compare.longevity.ombre',
    skinKey: 'compare.skin.all',
    popular: false,
  },
  {
    titleKey: 'svc.shaping.title',
    durationKey: 'svc.shaping.duration',
    priceKey: 'svc.shaping.price',
    longevityKey: 'compare.longevity.shaping',
    skinKey: 'compare.skin.all',
    popular: false,
  },
  {
    titleKey: 'svc.lip.title',
    durationKey: 'svc.lip.duration',
    priceKey: 'svc.lip.price',
    longevityKey: 'compare.longevity.lip',
    skinKey: 'compare.skin.all',
    popular: false,
  },
]

export default function ServiceComparison() {
  const { t } = useI18n()

  return (
    <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t('compare.heading')}
          </h2>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b-2 border-vermillion/20">
                <th className="py-3 px-3 text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark font-medium">
                  {t('compare.title')}
                </th>
                <th className="py-3 px-3 text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark font-medium">
                  {t('compare.duration')}
                </th>
                <th className="py-3 px-3 text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark font-medium">
                  {t('compare.longevity')}
                </th>
                <th className="py-3 px-3 text-left text-[10px] uppercase tracking-[0.2em] text-vermillion-dark font-medium">
                  {t('compare.skintype')}
                </th>
                <th className="py-3 px-3 text-right text-[10px] uppercase tracking-[0.2em] text-vermillion-dark font-medium">
                  {t('compare.price')}
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr
                  key={svc.titleKey}
                  className={`border-b border-vermillion/10 transition-colors ${
                    svc.popular
                      ? 'bg-vermillion/10'
                      : 'hover:bg-cream-dark/30'
                  }`}
                >
                  <td className="py-4 px-3">
                    <span className="font-serif text-sm text-charcoal">
                      {t(svc.titleKey)}
                    </span>
                    {svc.popular && (
                      <span className="ml-2 inline-block bg-vermillion text-soft-white text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5">
                        {t('badge.popular')}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-3 text-sm text-charcoal-light">
                    {t(svc.durationKey)}
                  </td>
                  <td className="py-4 px-3 text-sm text-charcoal-light">
                    {t(svc.longevityKey)}
                  </td>
                  <td className="py-4 px-3 text-sm text-charcoal-light">
                    {t(svc.skinKey)}
                  </td>
                  <td className="py-4 px-3 text-sm text-charcoal text-right font-serif">
                    {t(svc.priceKey)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
