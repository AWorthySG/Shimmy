"use client";

import Link from "next/link";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";
import FAQ, { faqs } from "@/components/FAQ";

/* ──────────────────────────────────────────────
   TODO: Update each service below with your
   actual offerings. Edit titles, prices,
   durations, descriptions, and included items.
   Add or remove services as needed.
   ────────────────────────────────────────────── */

export default function ServicesPage() {
  const { t } = useI18n();

  const services = [
    {
      title: t("svc.embroidery.title"),
      price: t("svc.embroidery.price"),       /* TODO: Your actual price */
      duration: t("svc.embroidery.duration"),  /* TODO: Your actual duration */
      description: t("svc.embroidery.desc"),
      popular: false,
      includes: [
        t("svc.embroidery.inc.1"),
        t("svc.embroidery.inc.2"),
        t("svc.embroidery.inc.3"),
        t("svc.embroidery.inc.4"),
      ],
    },
    {
      title: t("svc.microblading.title"),
      price: t("svc.microblading.price"),
      duration: t("svc.microblading.duration"),
      description: t("svc.microblading.desc"),
      popular: false,
      includes: [
        t("svc.microblading.inc.1"),
        t("svc.microblading.inc.2"),
        t("svc.microblading.inc.3"),
        t("svc.microblading.inc.4"),
      ],
    },
    {
      title: t("svc.nano.title"),
      price: t("svc.nano.price"),
      duration: t("svc.nano.duration"),
      description: t("svc.nano.desc"),
      popular: true,
      includes: [
        t("svc.nano.inc.1"),
        t("svc.nano.inc.2"),
        t("svc.nano.inc.3"),
        t("svc.nano.inc.4"),
      ],
    },
    {
      title: t("svc.ombre.title"),
      price: t("svc.ombre.price"),
      duration: t("svc.ombre.duration"),
      description: t("svc.ombre.desc"),
      popular: false,
      includes: [
        t("svc.ombre.inc.1"),
        t("svc.ombre.inc.2"),
        t("svc.ombre.inc.3"),
        t("svc.ombre.inc.4"),
      ],
    },
    {
      title: t("svc.shaping.title"),
      price: t("svc.shaping.price"),
      duration: t("svc.shaping.duration"),
      description: t("svc.shaping.desc"),
      popular: false,
      includes: [
        t("svc.shaping.inc.1"),
        t("svc.shaping.inc.2"),
        t("svc.shaping.inc.3"),
        t("svc.shaping.inc.4"),
      ],
    },
    {
      title: t("svc.lip.title"),
      price: t("svc.lip.price"),
      duration: t("svc.lip.duration"),
      description: t("svc.lip.desc"),
      popular: false,
      includes: [
        t("svc.lip.inc.1"),
        t("svc.lip.inc.2"),
        t("svc.lip.inc.3"),
        t("svc.lip.inc.4"),
      ],
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t("svcpage.tag")}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl shimmer-text">
            {t("svcpage.title")}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-charcoal-light">
            {t("svcpage.desc")}
          </p>
        </div>
      </section>

      {/* Oriental divider */}
      <div className="flex items-center justify-center gap-3 my-8"><div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" /><span className="text-vermillion/40 text-xs">✦</span><div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" /></div>

      {/* Services list */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
          {services.map((service, i) => (
            <AnimateOnScroll key={service.title} animation="fade-up" delay={i * 80}>
            <div
              className="relative group oriental-corner card-lift shine-on-hover border border-vermillion/15 bg-cream/30 overflow-hidden hover:border-vermillion/40"
            >
              {/* Most Popular badge (Task 5) */}
              {service.popular && (
                <span className="absolute top-0 right-0 z-20 bg-gold text-soft-white text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5">
                  Most Popular
                </span>
              )}
              {/* Service photo placeholder — TODO: replace with your actual service photos */}
              <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-cream-dark/60 via-cream to-soft-white flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="mx-auto w-16 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-3" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-warm-gray/50">
                    {service.title}
                  </p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-warm-gray/30">
                    Service photo
                  </p>
                  <div className="mx-auto w-16 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-3" />
                </div>
              </div>

              <div className="p-5 sm:p-8 md:p-10">
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="star-spin sparkle text-vermillion text-lg">✦</span>
                    <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
                      {service.title}
                    </h2>
                  </div>
                  <p className="mt-3 sm:mt-4 text-sm leading-relaxed text-charcoal-light">
                    {service.description}
                  </p>
                </div>
                <div className="flex flex-row gap-4 sm:gap-6 md:flex-col md:items-end md:text-right shrink-0">
                  <p className="font-serif text-lg sm:text-xl text-vermillion">
                    {service.price}
                  </p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-warm-gray">
                    {service.duration}
                  </p>
                </div>
              </div>

              {/* Includes */}
              <div className="mt-4 sm:mt-6 border-t border-vermillion/10 pt-4 sm:pt-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-3">
                  {t("svcpage.includes")}
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-charcoal-light"
                    >
                      <span className="mt-0.5 text-vermillion text-xs shrink-0">
                        ◆
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              </div>{/* end padding wrapper */}
            </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal md:text-3xl">
            {t("svcpage.unsure.title")}
          </h2>
          <p className="mt-3 text-sm text-charcoal-light">
            {t("svcpage.unsure.desc")}
          </p>
          {/* Urgency messaging (Task 6) */}
          <p className="text-sm text-red-600 font-medium mt-2">
            Limited slots available this month — book early to secure your preferred date.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center">
            {/* TODO: Replace with your WhatsApp number */}
            <a
              href="https://wa.me/6589308973"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic glow-pulse shine-on-hover w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vermillion px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark touch-target"
            >
              {t("cta.whatsapp")}
            </a>
            <Link
              href="/contact"
              className="text-sm uppercase tracking-[0.15em] text-vermillion-dark transition-colors hover:text-vermillion touch-target py-2"
            >
              Contact Page →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section (Task 12) ─── */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              Common Questions
            </p>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQ />
        </div>
        {/* FAQ JSON-LD structured data for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* ─── Bundle Offer (Task 8) ─── */}
      <section className="relative overflow-hidden bg-charcoal text-soft-white py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--vermillion)_0%,_transparent_70%)] opacity-10" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl text-gold md:text-4xl">The Full Shimmy</h2>
          <p className="mt-3 text-sm sm:text-base text-soft-white/80">
            Book any brow service and add a Nails by Shimmyhands set — save $15.
          </p>
          <p className="text-xs text-soft-white/50 mt-2 mb-6">
            Mention this offer when you message us on WhatsApp.
          </p>
          {/* TODO: Replace with real WhatsApp number */}
          <a
            href="https://wa.me/6589308973?text=Hi%2C%20I'd%20like%20the%20Full%20Shimmy%20bundle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-soft-white font-bold px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-gold/90 transition-colors touch-target"
          >
            Claim This Bundle
          </a>
        </div>
      </section>
    </>
  );
}
