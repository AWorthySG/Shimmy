"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";
import StatsBar from "@/components/StatsBar";
import EmailCapture from "@/components/EmailCapture";

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-cream-dark via-cream to-soft-white rice-paper px-4 sm:px-6 text-center">
        {/* Animated decorative circles */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-vermillion/5 animate-float" />
        <div className="pointer-events-none absolute -bottom-48 -left-48 h-80 w-80 sm:h-[500px] sm:w-[500px] rounded-full bg-jade/5 animate-float-reverse" />

        {/* Spinning decorative star — top right */}
        <div className="pointer-events-none absolute top-20 right-8 sm:right-20 text-vermillion/10 text-4xl sm:text-5xl animate-spin-slow animate-petal">
          ✦
        </div>
        {/* Breathing decorative star — bottom left */}
        <div className="pointer-events-none absolute bottom-24 left-6 sm:left-16 text-vermillion/10 text-3xl animate-breathe animate-petal-slow">
          ✦
        </div>

        <div className="relative z-10 max-w-3xl">
          {/* Animated ink-stroke divider */}
          <div className="mx-auto animate-expand-line h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-6" />

          <p className="animate-fade-in-up text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t("home.tag")}
          </p>

          <h1 className="animate-fade-in-up animate-delay-100 mt-4 sm:mt-6 font-serif text-4xl leading-tight tracking-wide text-charcoal sm:text-5xl md:text-7xl md:leading-[1.15]">
            {t("home.title.1")}
            <br />
            <span className="animate-shimmer shimmer-text">{t("home.title.2")}</span>
          </h1>

          <p className="animate-fade-in-up animate-delay-200 mx-auto mt-4 sm:mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-charcoal-light md:text-lg">
            {t("home.desc")}
          </p>

          <div className="animate-fade-in-up animate-delay-300 mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/brows"
              className="btn-magnetic shine-on-hover glow-pulse w-full sm:w-auto inline-block bg-vermillion px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white text-center hover:bg-vermillion-dark touch-target"
            >
              {t("home.explore.brows")}
            </Link>
            <Link
              href="/nails"
              className="btn-magnetic shine-on-hover glow-pulse w-full sm:w-auto inline-block border border-charcoal/20 px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-charcoal text-center hover:border-vermillion hover:text-vermillion touch-target"
            >
              {t("home.explore.nails")}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-fade-in-up animate-delay-600">
          <div className="flex flex-col items-center gap-2 text-warm-gray">
            <span className="text-[9px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
            <div className="h-8 w-[1px] bg-vermillion/40 animate-pulse-gold" />
          </div>
        </div>
      </section>

      {/* ─── Stats Bar (Task 4) ─── */}
      <section className="bg-soft-white px-4 sm:px-6">
        <StatsBar />
      </section>

      {/* ─── Oriental divider ─── */}
      <div className="flex items-center justify-center gap-3 my-8">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-xs">✦</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* ─── Two Sub-Brands ─── */}
      <section className="bg-soft-white py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-2">
            <Stagger staggerMs={200} animation="fade-up">
              {/* Brows */}
              <div className="group oriental-corner card-lift shine-on-hover border border-vermillion/15 bg-cream/50 overflow-hidden hover:border-vermillion/40">
                {/* Placeholder — TODO: replace with brow studio photo */}
                <div className="relative w-full aspect-[3/2] bg-gradient-to-br from-cream-dark/50 via-cream to-vermillion/5 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="mx-auto w-12 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-2" />
                    <p className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/40">
                      Brows by Shimmyhands
                    </p>
                    <div className="mx-auto w-12 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-2" />
                  </div>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal">
                    {t("home.brows.title")}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                    {t("home.brows.desc")}
                  </p>
                  <Link
                    href="/brows"
                    className="underline-grow mt-6 inline-block text-sm uppercase tracking-[0.15em] text-vermillion-dark transition-colors hover:text-vermillion touch-target py-2"
                  >
                    {t("home.brows.cta")}
                  </Link>
                  <div className="mx-auto mt-4 h-[1px] w-8 bg-vermillion/30 transition-all duration-500 group-hover:w-12 group-hover:bg-vermillion" />
                </div>
              </div>

              {/* Nails */}
              <div className="group oriental-corner card-lift shine-on-hover border border-vermillion/15 bg-cream/50 overflow-hidden hover:border-vermillion/40">
                {/* Product photo */}
                <div className="relative w-full aspect-[3/2] overflow-hidden bg-cream-dark">
                  <Image
                    src="/images/nails/ingenue-1.jpg"
                    alt="Nails by Shimmyhands press-on nails"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal">
                    {t("home.nails.title")}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                    {t("home.nails.desc")}
                  </p>
                  <Link
                    href="/nails"
                    className="underline-grow mt-6 inline-block text-sm uppercase tracking-[0.15em] text-vermillion-dark transition-colors hover:text-vermillion touch-target py-2"
                  >
                    {t("home.nails.cta")}
                  </Link>
                  <div className="mx-auto mt-4 h-[1px] w-8 bg-vermillion/30 transition-all duration-500 group-hover:w-12 group-hover:bg-vermillion" />
                </div>
              </div>
            </Stagger>
          </div>
        </div>
      </section>

      {/* ─── Oriental divider ─── */}
      <div className="flex items-center justify-center gap-3 my-8">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-xs">✦</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* ─── Testimonials ─── */}
      <section className="bg-cream py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="text-center">
            <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              {t("testimonials.tag")}
            </p>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
              {t("testimonials.title")}
            </h2>
          </AnimateOnScroll>

          <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-3">
            <Stagger staggerMs={150} animation="fade-up">
              {[
                {
                  name: t("testimonials.1.name"),
                  text: t("testimonials.1.text"),
                  service: t("testimonials.1.service"),
                  rating: 5,
                },
                {
                  name: t("testimonials.2.name"),
                  text: t("testimonials.2.text"),
                  service: t("testimonials.2.service"),
                  rating: 5,
                },
                {
                  name: t("testimonials.3.name"),
                  text: t("testimonials.3.text"),
                  service: t("testimonials.3.service"),
                  rating: 5,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="card-lift shine-on-hover border border-vermillion/15 overflow-hidden hover:border-vermillion/30"
                >
                  <div className="p-6 sm:p-8">
                    {/* Stars */}
                    <div className="flex gap-1 text-gold">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <span key={i} className="text-sm transition-transform duration-300 hover:scale-125">
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="mt-4 text-sm italic leading-relaxed text-charcoal-light">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    {/* Client info */}
                    <div className="mt-5 sm:mt-6 border-t border-vermillion/15 pt-5">
                      <p className="text-xs uppercase tracking-[0.15em] text-vermillion-dark font-medium">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-warm-gray">
                        {item.service}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative overflow-hidden shine-sweep bg-gradient-to-r from-cream-dark via-cream to-cream-dark py-16 sm:py-20 px-4 sm:px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--vermillion)_0%,_transparent_70%)] opacity-5" />
        {/* Animated background stars */}
        <div className="pointer-events-none absolute top-8 left-[15%] text-vermillion/8 text-2xl animate-spin-slow animate-petal">✦</div>
        <div className="pointer-events-none absolute bottom-12 right-[20%] text-vermillion/8 text-3xl animate-spin-slow animate-petal-slow" style={{ animationDirection: "reverse" }}>✦</div>

        <AnimateOnScroll animation="zoom-in" className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t("home.cta.title.1")}{" "}
            <span className="animate-shimmer">{t("home.cta.title.2")}</span>?
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-charcoal-light">
            {t("home.cta.desc")}
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/6589308973"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic animate-pulse-gold glow-pulse w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vermillion px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark touch-target"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("cta.whatsapp")}
            </a>
            <a
              href="https://instagram.com/shimmyhands.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic glow-pulse w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-charcoal/20 px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion touch-target"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              {t("cta.instagram")}
            </a>
          </div>
        </AnimateOnScroll>

        {/* Referral incentive (Task 9) */}
        <p className="relative z-10 text-sm text-center text-charcoal-light mt-6">
          {t("referral.text")}
        </p>
      </section>

      {/* ─── Email Capture (Task 7) ─── */}
      <section className="bg-cream py-12 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h3 className="font-serif text-lg sm:text-xl text-charcoal">
            {t("email.heading")}
          </h3>
          <div className="mt-6">
            <EmailCapture />
          </div>
        </div>
      </section>
    </>
  );
}
