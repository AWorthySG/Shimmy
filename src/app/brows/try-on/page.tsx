"use client";

import Link from "next/link";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import BrowTryOn from "@/components/BrowTryOn";
import { useI18n } from "@/lib/i18n";

export default function BrowTryOnPage() {
  const { t } = useI18n();

  return (
    <>
      {/* ─── Header ─── */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll animation="fade-up">
            <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
              {t("tryon.tag")}
            </p>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl shimmer-text">
              {t("tryon.title")}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-charcoal-light">
              {t("tryon.desc")}
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-vermillion-dark">
              <span aria-hidden="true" className="mr-2">
                ✦
              </span>
              {t("tryon.upload.privacy")}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Oriental divider */}
      <div className="flex items-center justify-center gap-3 my-8">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-xs">✦</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* ─── Visualizer ─── */}
      <section className="bg-soft-white py-10 sm:py-14 px-4 sm:px-6">
        <BrowTryOn />
      </section>

      {/* ─── How to Use ─── */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll animation="fade-up" className="text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              How It Works
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal">
              Three Steps
            </h2>
          </AnimateOnScroll>

          <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Pick a clear, front-facing photo from your gallery or take a fresh one with your camera.",
              },
              {
                step: "02",
                title: "Choose a Style",
                desc: "Try nano, microblading, ombre, or embroidery — adjust thickness, colour depth, and arch position to taste.",
              },
              {
                step: "03",
                title: "See & Share",
                desc: "Download your preview or send it straight to us on WhatsApp to start a consultation.",
              },
            ].map((s, i) => (
              <AnimateOnScroll key={s.step} animation="fade-up" delay={i * 100}>
                <div className="border border-vermillion/15 bg-cream/40 p-6 sm:p-8 h-full">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-vermillion-dark">
                    {s.step}
                  </p>
                  <h3 className="mt-3 font-serif text-lg text-charcoal">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                    {s.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-cream-dark via-cream to-cream-dark py-16 sm:py-20 px-4 sm:px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--vermillion)_0%,_transparent_70%)] opacity-5" />
        <AnimateOnScroll animation="zoom-in" className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t("tryon.cta.title")}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-charcoal-light">
            {t("tryon.cta.desc")}
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-block bg-vermillion px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors"
            >
              {t("tryon.cta.book")}
            </Link>
            <Link
              href="/brows/services"
              className="w-full sm:w-auto inline-block border border-charcoal/20 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion transition-colors"
            >
              {t("services.viewall")}
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
