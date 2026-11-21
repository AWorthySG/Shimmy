"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { HomeWithIntro } from "@/components/home-with-intro";
import { useI18n } from "@/lib/i18n";
import StatsBar from "@/components/StatsBar";
import BookingForm from "@/components/BookingForm";
import StickyBookBar from "@/components/StickyBookBar";
import CinematicHero from "@/components/CinematicHero";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ShowcaseSection from "@/components/ShowcaseSection";
import { BROW_SHOWCASE } from "@/lib/showcase";
import { Plus, Sparkle, Star, TrailingArrow } from "@/components/icons";

const FAQS = [1, 2, 3, 4].map((n) => ({ q: `faq.brows.${n}.q`, a: `faq.brows.${n}.a` }));

export default function Home() {
  const { t } = useI18n();

  const featuredServices = [
    {
      title: t("services.embroidery.title"),
      description: t("services.embroidery.desc"),
      price: t("svc.embroidery.price"),
      href: "/brows/services/eyebrow-embroidery",
      image: "/images/brows/brow-process-hand.jpg",
    },
    {
      title: t("services.nano.title"),
      description: t("services.nano.desc"),
      price: t("svc.nano.price"),
      href: "/brows/services/nano-brows",
      image: "/images/brows/brow-result-hairstroke-1.jpg",
    },
    {
      title: t("services.ombre.title"),
      description: t("services.ombre.desc"),
      price: t("svc.ombre.price"),
      href: "/brows/services/ombre-powder-brows",
      image: "/images/brows/brow-result-eyes-closeup.jpg",
    },
  ];

  const testimonials = [
    {
      name: t("testimonials.1.name"),
      text: t("testimonials.1.text"),
      service: t("testimonials.1.service"),
      rating: 5,
      portrait: "/images/testimonials/hui-ling-portrait.jpg",
    },
    {
      name: t("testimonials.2.name"),
      text: t("testimonials.2.text"),
      service: t("testimonials.2.service"),
      rating: 5,
      portrait: "/images/testimonials/priya-portrait.jpg",
    },
    {
      name: t("testimonials.3.name"),
      text: t("testimonials.3.text"),
      service: t("testimonials.3.service"),
      rating: 5,
      portrait: "/images/testimonials/nurul-portrait.jpg",
    },
  ];

  return (
    <HomeWithIntro>
    <>
      {/* 1. Hero: three brow clips behind the headline */}
      <CinematicHero
        clips={[
          { src: "/videos/brows/brow-mapping.mp4", poster: "/videos/brows/brow-mapping.jpg", alt: "Brow mapping before a session" },
          { src: "/videos/brows/the-artistry.mp4", poster: "/videos/brows/the-artistry.jpg", alt: "Brow artistry at Shimmy" },
          { src: "/videos/brows/the-reveal.mp4", poster: "/videos/brows/the-reveal.jpg", alt: "A client seeing her new brows" },
        ]}
        eyebrow={t("hero.tag")}
        title={
          <>
            {t("hero.title.1")}
            <br />
            <em className="font-sans italic font-normal text-on-scrim/90">{t("hero.title.2")}</em>
          </>
        }
        desc={t("hero.desc")}
        actions={
          <>
            <Link href="#book" className="btn btn-scrim btn-lg w-full sm:w-auto touch-target">
              {t("nav.book")}
            </Link>
            <Link href="/brows/services" className="btn btn-scrim-outline btn-lg w-full sm:w-auto touch-target">
              {t("hero.cta.services")}
            </Link>
          </>
        }
        footer={<StatsBar tone="light" />}
      />

      {/* 2. Services: one row each, photo beside text */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t("services.tag")}</p>
              <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t("services.title")}</h2>
            </div>
            <Link
              href="/brows/services"
              className="text-sm uppercase tracking-button text-vermillion-dark transition-colors hover:text-vermillion touch-target inline-flex items-center py-2"
            >
              {t("services.viewall")}<TrailingArrow />
            </Link>
          </AnimateOnScroll>

          <ul className="mt-8 divide-y divide-vermillion/15 border-y border-vermillion/15 md:mt-10">
            {featuredServices.map((service) => (
              <li key={service.href}>
                <Link href={service.href} className="group grid grid-cols-[96px_1fr] items-center gap-4 py-5 sm:grid-cols-[160px_1fr_auto] sm:gap-8 sm:py-6">
                  <div className="reveal-mask relative aspect-square overflow-hidden bg-cream-dark sm:aspect-[4/3]">
                    <Image
                      src={service.image}
                      alt={`${service.title} result by Shimmy`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 96px, 160px"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-lg text-charcoal group-hover:text-vermillion-dark sm:text-xl">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-xs text-warm-gray sm:hidden">{service.price}</p>
                    <p className="mt-2 hidden text-sm leading-relaxed text-charcoal-light sm:block">{service.description}</p>
                  </div>
                  <div className="hidden items-center gap-3 text-sm text-charcoal sm:flex">
                    {service.price}
                    <TrailingArrow />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Results: drag-to-compare slider beside the try-on */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-12 md:gap-14">
          <div className="reveal md:order-2 md:col-span-5">
            <p className="eyebrow">{t("results.tag")}</p>
            <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t("ba.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-light sm:text-base">{t("ba.desc")}</p>
            <Link
              href="/brows/gallery"
              className="mt-3 text-sm uppercase tracking-button text-vermillion-dark transition-colors hover:text-vermillion touch-target inline-flex items-center py-2"
            >
              See the full gallery<TrailingArrow />
            </Link>

            <div className="mt-8 border-t border-vermillion/15 pt-8">
              <h3 className="font-sans font-medium text-lg text-charcoal sm:text-xl">{t("tryon.discover.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-light sm:text-base">{t("tryon.discover.desc")}</p>
              <Link href="/brows/try-on" className="btn btn-secondary mt-5 touch-target">
                {t("tryon.discover.cta")}<TrailingArrow />
              </Link>
              <p className="mt-4 text-[10px] uppercase tracking-label text-vermillion-dark">
                <Sparkle className="mr-2 inline-block h-3 w-3 align-[-0.1em]" />
                {t("tryon.upload.privacy")}
              </p>
            </div>
          </div>

          <div className="reveal md:order-1 md:col-span-7">
            <BeforeAfterSlider
              src="/images/brows/brow-before-after-closeup-clean.jpg"
              width={518}
              height={690}
              alt={t("ba.alt")}
              beforeLabel={t("ba.before")}
              afterLabel={t("ba.after")}
            />
          </div>
        </div>
      </section>

      <ShowcaseSection titleKey="showcase.title.brows" items={BROW_SHOWCASE} />

      {/* 4. Testimonials: swipe on phones, three columns on desktop */}
      <section className="bg-soft-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="px-4 sm:px-6">
            <p className="eyebrow">{t("testimonials.tag")}</p>
            <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t("testimonials.title")}</h2>
          </AnimateOnScroll>

          <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {testimonials.map((item) => (
              <li
                key={item.name}
                className="flex w-[82%] shrink-0 snap-start flex-col border border-vermillion/15 bg-cream/40 p-6 sm:w-[60%] md:w-auto md:p-8"
              >
                <div className="flex gap-1 text-gold" aria-label={`${item.rating} out of 5`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm italic leading-relaxed text-charcoal-light">
                  &ldquo;{item.text}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-vermillion/15 pt-5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-vermillion/20">
                    <Image src={item.portrait} alt={item.name} fill className="object-cover" sizes="44px" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-button font-medium text-vermillion-dark">{item.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-button text-warm-gray">{item.service}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Booking with the FAQ beside it */}
      <section id="book" className="scroll-mt-20 bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <AnimateOnScroll animation="fade-up" className="mb-8">
              <p className="eyebrow">{t("book.online.tag")}</p>
              <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t("book.online.title")}</h2>
              <p className="mt-2 text-sm text-charcoal-light">{t("urgency.brows")}</p>
            </AnimateOnScroll>
            <BookingForm />
            <p className="mt-6 text-sm text-charcoal-light">
              {t("referral.wa.prefix")}{" "}
              <a href="https://wa.me/6589308973" target="_blank" rel="noopener noreferrer" className="text-vermillion hover:text-vermillion-dark transition-colors">
                +65 8930 8973
              </a>
            </p>
            <p className="mt-2 text-sm text-charcoal-light">{t("referral.text")}</p>
          </div>

          <aside className="lg:col-span-5">
            <p className="eyebrow">{t("faq.tag")}</p>
            <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t("faq.title")}</h2>
            <div className="mt-6 divide-y divide-vermillion/15 border-y border-vermillion/15">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-medium text-charcoal">
                    {t(faq.q)}
                    <Plus className="mt-1 h-4 w-4 shrink-0 text-vermillion transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-light">{t(faq.a)}</p>
                </details>
              ))}
            </div>
          </aside>
        </div>
        {/* FAQ JSON-LD structured data for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((item) => ({
                "@type": "Question",
                name: t(item.q),
                acceptedAnswer: { "@type": "Answer", text: t(item.a) },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      </section>
    </>
    <StickyBookBar serviceName={t("hero.cta.book")} href="/brows" />
    </HomeWithIntro>
  );
}
