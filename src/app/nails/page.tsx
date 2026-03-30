"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";
import { collections, products } from "@/lib/products";
import { NailsWithIntro } from "@/components/nails-with-intro";

export default function NailsPage() {
  const { t } = useI18n();

  // Compute min price per collection for "From $X" display (Task 2)
  const collectionMinPrices: Record<string, number> = {};
  for (const p of products) {
    if (!collectionMinPrices[p.collectionHandle] || p.price < collectionMinPrices[p.collectionHandle]) {
      collectionMinPrices[p.collectionHandle] = p.price;
    }
  }

  return (
    <NailsWithIntro>
    <>
      {/* ─── Hero — Full-bleed cinematic video ─── */}
      <section className="relative flex min-h-[65vh] sm:min-h-[75vh] md:min-h-[85vh] flex-col items-center justify-center overflow-hidden text-center">
        {/* Background video with cinematic slow zoom */}
        <div className="absolute inset-0 overflow-hidden video-vignette">
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover video-cinematic"
            style={{ filter: "brightness(0.8) saturate(1.1) contrast(1.05)" }}
          >
            <source src="/videos/nail-5.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Soft gradient overlay — lighter at center for text, darker at edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-soft-white/50 via-transparent to-soft-white/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_var(--soft-white)_100%)] opacity-60" />

        <div className="relative z-10 max-w-3xl px-4 sm:px-6">
          <div className="mx-auto animate-expand-line h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />

          <p className="text-reveal text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t("nails.hero.tag")}
          </p>

          <h1 className="text-reveal mt-3 sm:mt-4 font-serif text-3xl leading-tight tracking-wide text-charcoal sm:text-5xl md:text-7xl md:leading-[1.15]" style={{ animationDelay: "0.15s" }}>
            {t("nails.hero.title.1")}
            <br />
            <span className="animate-shimmer shimmer-text">
              {t("nails.hero.title.2")}
            </span>
          </h1>

          <p className="text-reveal mx-auto mt-3 sm:mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-charcoal-light" style={{ animationDelay: "0.3s" }}>
            {t("nails.hero.desc")}
          </p>

          <div className="text-reveal mt-6 sm:mt-8" style={{ animationDelay: "0.45s" }}>
            <Link
              href="/nails/shop"
              className="btn-magnetic shine-on-hover glow-pulse w-full sm:w-auto inline-block bg-vermillion px-6 sm:px-8 py-3 text-xs uppercase tracking-[0.2em] text-soft-white text-center hover:bg-vermillion-dark touch-target"
            >
              {t("nails.hero.cta")}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-reveal" style={{ animationDelay: "0.8s" }}>
          <div className="flex flex-col items-center gap-1.5 text-warm-gray">
            <span className="text-[9px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
            <div className="h-6 w-[1px] bg-vermillion/40 animate-pulse-gold" />
          </div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="flex items-center justify-center gap-3 my-4 sm:my-5">
        <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-[10px]">✦</span>
        <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* ─── Collections Grid — with cinematic video cards ─── */}
      <section className="bg-soft-white py-10 sm:py-12 md:py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="text-center">
            <div className="mx-auto h-[2px] w-[50px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              {t("nails.shop.tag")}
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
              {t("nails.shop.title")}
            </h2>
          </AnimateOnScroll>

          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Stagger staggerMs={100} animation="fade-up">
              {collections.map((collection) => {
                const src = collection.image;
                const isVideo = src?.endsWith(".mp4");
                const isImage = src && !isVideo;

                return (
                <Link
                  key={collection.handle}
                  href={`/nails/shop/${collection.handle}`}
                  className="group oriental-corner card-lift shine-on-hover border border-vermillion/15 bg-cream/50 overflow-hidden hover:border-vermillion/40"
                >
                  {/* Collection visual with immersive hover */}
                  <div className="relative w-full aspect-[3/2] bg-gradient-to-br from-cream-dark/50 via-cream to-vermillion/5 overflow-hidden">
                    {isImage ? (
                      <Image
                        src={src}
                        alt={collection.title}
                        fill
                        className="object-cover zoom-smooth"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : isVideo ? (
                      <video
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover zoom-smooth"
                      >
                        <source src={src} type="video/mp4" />
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center px-4">
                          <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-2" />
                          <p className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/40">
                            {collection.title}
                          </p>
                          <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-2" />
                        </div>
                      </div>
                    )}
                    {/* Hover overlay with collection name */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center pb-4 z-10">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-soft-white/90">
                        View Collection →
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-serif text-base sm:text-lg text-charcoal">
                      {collection.title}
                    </h3>
                    {/* Collection price range (Task 2) */}
                    {collectionMinPrices[collection.handle] && (
                      <p className="text-sm font-medium text-gold mt-1">
                        From ${collectionMinPrices[collection.handle]}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                      {collection.description}
                    </p>
                    <div className="mx-auto mt-4 h-[1px] w-6 bg-vermillion/30 transition-all duration-500 group-hover:w-10 group-hover:bg-vermillion" />
                  </div>
                </Link>
                );
              })}
            </Stagger>
          </div>

          <AnimateOnScroll animation="fade-up" delay={300} className="mt-6 sm:mt-8 text-center">
            <Link
              href="/nails/shop"
              className="btn-magnetic shine-on-hover glow-pulse inline-block bg-vermillion px-6 sm:px-8 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark touch-target"
            >
              {t("shop.all")} →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="flex items-center justify-center gap-3 my-4 sm:my-5">
        <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-[10px]">✦</span>
        <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* ─── Handcrafted Quality — cinematic split with Ken Burns ─── */}
      <section className="bg-cream py-10 sm:py-12 md:py-14 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-6 sm:gap-8 md:grid-cols-2">
          <AnimateOnScroll animation="fade-right">
            <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
              <Image
                src="/images/nails/ingenue-lifestyle.jpg"
                alt="Nails by Shimmyhands — press-on nails worn on hand"
                fill
                className="object-cover ken-burns"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(46,51,40,0.15)_100%)] pointer-events-none" />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-left" delay={150}>
            <div className="h-[2px] w-[50px] bg-gradient-to-r from-vermillion/60 to-transparent mb-3" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              {t("shop.handcrafted.tag")}
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl sparkle">
              {t("shop.handcrafted.title")}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-charcoal-light">
              {t("shop.handcrafted.desc")}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Video Showcase — immersive gallery with hover reveals ─── */}
      <section className="bg-soft-white py-10 sm:py-12 md:py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="text-center mb-6 sm:mb-8">
            <div className="mx-auto h-[2px] w-[50px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              Behind the Scenes
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
              See the Artistry
            </h2>
          </AnimateOnScroll>

          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Stagger staggerMs={100} animation="fade-up">
              {/* On-hand lifestyle photos with Ken Burns */}
              <div className="group card-lift overflow-hidden border border-vermillion/10 bg-cream/30">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src="/images/nails/lifestyle-onhand-1.jpg" alt="Press-on nails — worn" fill className="object-cover ken-burns" sizes="(max-width: 768px) 50vw, 25vw" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">Sweater Weather</p>
                </div>
              </div>
              <div className="group card-lift overflow-hidden border border-vermillion/10 bg-cream/30">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src="/images/nails/lifestyle-onhand-3.jpg" alt="Press-on nails — detail" fill className="object-cover ken-burns" style={{ animationDirection: "reverse" }} sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">On Hand</p>
                </div>
              </div>
              {/* Lifestyle videos with cinematic zoom */}
              <div className="group card-lift overflow-hidden border border-vermillion/10 bg-cream/30">
                <div className="relative aspect-[3/4] overflow-hidden video-vignette">
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover video-cinematic">
                    <source src="/videos/lifestyle-vid-1.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">The Process</p>
                </div>
              </div>
              <div className="group card-lift overflow-hidden border border-vermillion/10 bg-cream/30">
                <div className="relative aspect-[3/4] overflow-hidden video-vignette">
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover video-cinematic" style={{ animationDelay: "-5s" }}>
                    <source src="/videos/lifestyle-vid-2.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">Up Close</p>
                </div>
              </div>
            </Stagger>
          </div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="flex items-center justify-center gap-3 my-4 sm:my-5">
        <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-[10px]">✦</span>
        <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* ─── CTA Banner ─── */}
      <section className="relative overflow-hidden shine-sweep bg-gradient-to-r from-cream-dark via-cream to-cream-dark gradient-animate py-10 sm:py-12 px-4 sm:px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--vermillion)_0%,_transparent_70%)] opacity-5" />
        <div className="pointer-events-none absolute top-6 left-[15%] text-vermillion/8 text-2xl animate-drift">
          ✦
        </div>
        <div
          className="pointer-events-none absolute bottom-8 right-[20%] text-vermillion/8 text-3xl animate-drift"
          style={{ animationDelay: "-4s", animationDirection: "reverse" }}
        >
          ✦
        </div>
        <div className="pointer-events-none absolute top-[40%] right-[10%] text-vermillion/5 text-xl animate-drift" style={{ animationDelay: "-8s" }}>
          ✦
        </div>

        <AnimateOnScroll animation="zoom-in" className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t("home.cta.title.1")}{" "}
            <span className="animate-shimmer">{t("home.cta.title.2")}</span>?
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-charcoal-light">
            {t("home.cta.desc")}
          </p>
          <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/6512345678"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic animate-pulse-gold glow-pulse w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vermillion px-6 sm:px-8 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark touch-target"
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
              className="btn-magnetic glow-pulse w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-charcoal/20 px-6 sm:px-8 py-3 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion touch-target"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              {t("cta.instagram")}
            </a>
          </div>
        </AnimateOnScroll>
      </section>
    </>
    </NailsWithIntro>
  );
}
