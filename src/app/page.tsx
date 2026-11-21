"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import CinematicHero from "@/components/CinematicHero";
import ShowcaseSection from "@/components/ShowcaseSection";
import BeforeAfterFeature from "@/components/BeforeAfterFeature";
import { HOME_SHOWCASE } from "@/lib/showcase";
import { useI18n } from "@/lib/i18n";
import StatsBar from "@/components/StatsBar";
import EmailCapture from "@/components/EmailCapture";
import Stories from "@/components/Stories";
import { Star, TrailingArrow } from "@/components/icons";

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      {/* ─── Hero ─── */}
      <CinematicHero
        clips={[
          { src: "/videos/brows/the-artistry.mp4", poster: "/videos/brows/the-artistry.jpg", alt: "Brow artistry at Shimmy" },
          { src: "/videos/nail-5.mp4", poster: "/videos/nail-5.jpg", alt: "Handmade press-on nails by Shimmyhands" },
          { src: "/videos/brows/the-reveal.mp4", poster: "/videos/brows/the-reveal.jpg", alt: "A client seeing her new brows" },
        ]}
        eyebrow={t("home.tag")}
        title={
          <>
            {t("home.title.1")}
            <br />
            <em className="font-sans italic font-normal text-on-scrim/90">{t("home.title.2")}</em>
          </>
        }
        desc={t("home.desc")}
        actions={
          <>
            <Link href="/brows" className="btn btn-scrim btn-lg w-full sm:w-auto touch-target">
              {t("home.explore.brows")}
            </Link>
            <Link href="/nails" className="btn btn-scrim-outline btn-lg w-full sm:w-auto touch-target">
              {t("home.explore.nails")}
            </Link>
          </>
        }
        footer={<StatsBar tone="light" />}
      />

      {/* ─── Stories ─── */}
      <section className="bg-on-scrim py-6 px-4 sm:px-6">
        <Stories />
      </section>

      {/* ─── Two studios: full-bleed panels ─── */}
      <section className="grid md:grid-cols-2">
        {[
          { href: "/brows", img: "/images/brows/brow-result-clean-front.jpg", alt: "Freshly shaped brows by Shimmy", title: t("home.brows.title"), desc: t("home.brows.desc"), cta: t("home.brows.cta") },
          { href: "/nails", img: "/images/nails/main-hero-cat-mirror.jpg", alt: "Nude French-tip press-on nails styled with florals", title: t("home.nails.title"), desc: t("home.nails.desc"), cta: t("home.nails.cta") },
        ].map((p) => (
          <Link key={p.href} href={p.href} className="group parallax relative flex min-h-[70svh] items-end overflow-hidden bg-scrim text-on-scrim md:min-h-[85svh]">
            <Image src={p.img} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-scrim/85 via-scrim/20 to-transparent" aria-hidden="true" />
            <div className="reveal relative p-6 sm:p-10 md:p-12">
              <h2 className="font-serif text-4xl text-on-scrim md:text-5xl">{p.title}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-on-scrim/85 sm:text-base">{p.desc}</p>
              <span className="mt-6 inline-flex items-center text-sm uppercase tracking-button text-on-scrim">
                {p.cta}<TrailingArrow />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <ShowcaseSection titleKey="showcase.title.home" items={HOME_SHOWCASE} />

      <BeforeAfterFeature />

      {/* ─── Testimonials ─── */}
      <section className="bg-cream py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="text-center">
            <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
            <p className="eyebrow">
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
                  className="card-lift border border-vermillion/15 overflow-hidden hover:border-vermillion/30"
                >
                  <div className="p-6 sm:p-8">
                    {/* Stars */}
                    <div className="flex gap-1 text-gold">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="mt-4 text-sm italic leading-relaxed text-charcoal-light">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    {/* Client info */}
                    <div className="mt-5 sm:mt-6 border-t border-vermillion/15 pt-5">
                      <p className="text-xs uppercase tracking-button text-vermillion-dark font-medium">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-button text-warm-gray">
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
      <section className="relative overflow-hidden bg-gradient-to-r from-cream-dark via-cream to-cream-dark py-16 sm:py-20 px-4 sm:px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--vermillion)_0%,_transparent_70%)] opacity-5" />

        <AnimateOnScroll animation="zoom-in" className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t("home.cta.title.1")}{" "}
            <span className="">{t("home.cta.title.2")}</span>?
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-charcoal-light">
            {t("home.cta.desc")}
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/6589308973"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg animate-pulse-gold w-full sm:w-auto touch-target"
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
              className="btn btn-outline btn-lg w-full sm:w-auto touch-target"
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
          <h3 className="font-sans font-medium text-lg sm:text-xl text-charcoal">
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
