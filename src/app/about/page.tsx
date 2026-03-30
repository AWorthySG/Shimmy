"use client";

import Link from "next/link";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";

/* ──────────────────────────────────────────────
   TODO: Update these values to reflect your
   actual brand values and philosophy.
   ────────────────────────────────────────────── */

export default function AboutPage() {
  const { t } = useI18n();

  const values = [
    {
      title: t("aboutpage.v1.title"),
      description: t("aboutpage.v1.desc"),
    },
    {
      title: t("aboutpage.v2.title"),
      description: t("aboutpage.v2.desc"),
    },
    {
      title: t("aboutpage.v3.title"),
      description: t("aboutpage.v3.desc"),
    },
    {
      title: t("aboutpage.v4.title"),
      description: t("aboutpage.v4.desc"),
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t("aboutpage.tag")}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl shimmer-text">
            {t("aboutpage.title")}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="bg-soft-white py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 md:gap-16 md:grid-cols-2">
          {/* ┌──────────────────────────────────────┐
              │  TODO: Replace with your photo.       │
              │  Use next/image:                       │
              │  <Image src="/artist.jpg" fill         │
              │    alt="Shimmyhands artist"            │
              │    className="object-cover" />         │
              └──────────────────────────────────────┘ */}
          <AnimateOnScroll animation="fade-right">
          <div className="aspect-[3/4] bg-gradient-to-br from-vermillion/10 via-cream-dark to-jade/5 flex items-center justify-center reveal-overlay">
            <div className="text-center">
              <span className="text-5xl sm:text-7xl text-gold/20 animate-petal-slow">✦</span>
              <p className="mt-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-warm-gray">
                Artist Photo
              </p>
            </div>
          </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-left" delay={150}>
          <div>
            <div className="h-[2px] w-[60px] bg-gradient-to-r from-vermillion/60 to-transparent mb-4" />
            {/* TODO: Update about headline */}
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
              {t("aboutpage.headline.1")}
              <br />
              {t("aboutpage.headline.2")}
            </h2>

            {/* TODO: Write your personal brand story */}
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-charcoal-light">
              <p>
                {t("aboutpage.p1")}
              </p>
              <p>
                {t("aboutpage.p2")}
              </p>
              <p>
                {t("aboutpage.p3")}
              </p>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Oriental divider */}
      <div className="flex items-center justify-center gap-3 my-8"><div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" /><span className="text-vermillion/40 text-xs">✦</span><div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" /></div>

      {/* Values */}
      <section className="bg-cream py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              {t("aboutpage.values.tag")}
            </p>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
              {t("aboutpage.values.title")}
            </h2>
          </div>

          <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2">
            {values.map((value, i) => (
              <AnimateOnScroll key={value.title} animation="fade-up" delay={i * 100}>
              <div
                className="border-l-2 border-jade/30 pl-5 sm:pl-6 py-2 transition-all duration-300 hover:border-jade shine-on-hover"
              >
                <h3 className="font-serif text-lg sm:text-xl text-charcoal">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                  {value.description}
                </p>
              </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-cream-dark py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion">
            {t("aboutpage.certs.tag")}
          </p>
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t("aboutpage.certs.title")}
          </h2>
          {/* TODO: Update with your actual certifications */}
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-warm-gray">
            {t("aboutpage.certs.desc")}
          </p>
          {/* ┌──────────────────────────────────────┐
              │  TODO: Replace with your actual       │
              │  certification logos / badges.         │
              │  Use next/image for each.              │
              └──────────────────────────────────────┘ */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-md sm:max-w-none mx-auto">
            {["Certification 1", "Certification 2", "Certification 3"].map(
              (cert) => (
                <div
                  key={cert}
                  className="flex h-16 sm:h-20 items-center justify-center border border-vermillion/15 text-[10px] sm:text-xs text-warm-gray"
                >
                  {cert}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-12 sm:py-16 px-4 sm:px-6 text-center">
        <h2 className="font-serif text-xl sm:text-2xl text-charcoal md:text-3xl">
          {t("aboutpage.cta.title.1")} <span className="text-vermillion">{t("aboutpage.cta.title.2")}</span>?
        </h2>
        <p className="mt-3 text-sm text-charcoal-light">
          {t("aboutpage.cta.desc")}
        </p>
        <Link
          href="/contact"
          className="mt-6 sm:mt-8 inline-block bg-vermillion px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white transition-all duration-300 hover:bg-vermillion-dark touch-target glow-pulse shine-on-hover"
        >
          {t("aboutpage.cta.btn")}
        </Link>
      </section>
    </>
  );
}
