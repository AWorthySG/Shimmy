"use client";

import Image from "next/image";
import LazyVideo from "@/components/LazyVideo";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { HomeWithIntro } from "@/components/home-with-intro";
import { useI18n } from "@/lib/i18n";
import StatsBar from "@/components/StatsBar";
import BookingForm from "@/components/BookingForm";
import StickyBookBar from "@/components/StickyBookBar";
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
      {/* 1. Hero: text beside a result photo */}
      <section className="bg-gradient-to-b from-cream-dark via-cream to-soft-white rice-paper px-4 sm:px-6 pt-10 pb-8 sm:pt-16 md:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="text-center md:text-left">
            <p className="eyebrow animate-fade-in-up">{t("hero.tag")}</p>
            <h1 className="animate-fade-in-up animate-delay-100 mt-4 font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
              {t("hero.title.1")}
              <br />
              {t("hero.title.2")}
            </h1>
            <p className="animate-fade-in-up animate-delay-200 mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-charcoal-light md:mx-0 md:text-lg">
              {t("hero.desc")}
            </p>
            <div className="animate-fade-in-up animate-delay-300 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link href="#book" className="btn btn-primary btn-lg w-full sm:w-auto touch-target">
                {t("nav.book")}
              </Link>
              <Link href="/brows/services" className="btn btn-outline btn-lg w-full sm:w-auto touch-target">
                {t("hero.cta.services")}
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden bg-cream-dark md:aspect-[4/5] md:max-w-none">
            <Image
              src="/images/brows/brow-result-clean-front.jpg"
              alt="Freshly shaped brows by Shimmy"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 448px, 50vw"
            />
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl sm:mt-14">
          <StatsBar />
        </div>
      </section>

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
                  <div className="relative aspect-square overflow-hidden bg-cream-dark sm:aspect-[4/3]">
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

      {/* 3. Results and try-on: text beside a photo and video mosaic */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
          <AnimateOnScroll animation="fade-up" className="md:order-2">
            <p className="eyebrow">{t("results.tag")}</p>
            <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t("results.title")}</h2>
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
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-3 md:order-1">
            <Link href="/brows/gallery" className="group relative row-span-2 aspect-[9/16] overflow-hidden bg-cream-dark">
              <LazyVideo
                src="/videos/brows/the-reveal.mp4"
                poster="/videos/brows/the-reveal.jpg"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-0 left-0 bg-charcoal/60 px-2 py-1 text-[10px] uppercase tracking-label text-soft-white">
                The reveal
              </span>
            </Link>
            {[
              { src: "/images/brows/brow-before-after-split.jpg", label: "Before and after" },
              { src: "/images/brows/brow-before-after-mens.jpg", label: "Men's brows" },
            ].map((item) => (
              <Link key={item.src} href="/brows/gallery" className="group relative overflow-hidden bg-cream-dark">
                <Image
                  src={item.src}
                  alt={`${item.label}: eyebrow result by Shimmy`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-0 left-0 bg-charcoal/60 px-2 py-1 text-[10px] uppercase tracking-label text-soft-white">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
