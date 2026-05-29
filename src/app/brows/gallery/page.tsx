"use client";

import Image from "next/image";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";

/* ──────────────────────────────────────────────
   Gallery items. Tiles with a `src` render a real
   photo (from /public/images/brows/); the rest stay
   as gradient placeholders until more photos are added.
   ────────────────────────────────────────────── */
type GalleryItem = { id: number; label: string; gradient: string; src?: string };

const galleryItems: GalleryItem[] = [
  { id: 1, label: "Before & After", gradient: "from-vermillion/10 to-cream-dark", src: "/images/brows/brow-before-after-split.jpg" },
  { id: 2, label: "Brow Transformation", gradient: "from-cream-dark to-jade/10", src: "/images/brows/brow-before-after-1.jpg" },
  { id: 3, label: "Before & After", gradient: "from-jade/10 to-cream-dark", src: "/images/brows/brow-before-after-closeup.jpg" },
  { id: 4, label: "Natural Brows", gradient: "from-cream-dark to-vermillion/10", src: "/images/brows/brow-before-after-2.jpg" },
  { id: 5, label: "Men's Brows", gradient: "from-vermillion/10 to-cream-dark", src: "/images/brows/brow-before-after-mens.jpg" },
  { id: 6, label: "Microblading", gradient: "from-cream-dark to-jade/10" },
  { id: 7, label: "Ombre Powder Brows", gradient: "from-jade/10 to-cream-dark" },
  { id: 8, label: "Lip Blush", gradient: "from-cream-dark to-vermillion/10" },
  { id: 9, label: "Healed Results", gradient: "from-vermillion/10 to-cream-dark" },
];

/* ──────────────────────────────────────────────
   "See the Process" clips. Drop web-sized brow
   videos (~720p, under ~3 MB each) into
   /public/videos/brows/, then set `src` on each
   item to swap its placeholder for the real clip.
   ────────────────────────────────────────────── */
type ProcessClip = { label: string; src?: string };

const processClips: ProcessClip[] = [
  { label: "Brow Mapping", src: "/videos/brows/brow-mapping.mp4" },
  { label: "Precision Work", src: "/videos/brows/precision-work.mp4" },
  { label: "The Artistry", src: "/videos/brows/the-artistry.mp4" },
  { label: "The Reveal", src: "/videos/brows/the-reveal.mp4" },
];

export default function GalleryPage() {
  const { t } = useI18n();

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t("gallery.tag")}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl shimmer-text">
            {t("gallery.title")}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-charcoal-light">
            {t("gallery.desc")}
          </p>
        </div>
      </section>

      {/* Oriental divider */}
      <div className="flex items-center justify-center gap-3 my-8"><div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" /><span className="text-vermillion/40 text-xs">✦</span><div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" /></div>

      {/* Gallery grid — 1 col phone, 2 col tablet, 3 col desktop */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, i) => (
              <AnimateOnScroll key={item.id} animation="zoom-in" delay={i * 80}>
              <div
                className="group relative aspect-square overflow-hidden bg-gradient-to-br border border-vermillion/10 card-lift shine-on-hover hover:border-vermillion/30"
              >
                {item.src ? (
                  <>
                    <Image
                      src={item.src}
                      alt={`${item.label} — eyebrow result by Shimmy`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Label revealed on hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal/0 opacity-0 transition-all duration-500 group-hover:bg-charcoal/40 group-hover:opacity-100 px-4">
                      <p className="font-serif text-base sm:text-lg text-soft-white text-center drop-shadow">
                        {item.label}
                      </p>
                      <div className="mt-2 h-[1px] w-8 bg-soft-white" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Gradient placeholder — add a `src` to show a real photo */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                    />

                    {/* Overlay content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-soft-white/80">
                      {/* Default state */}
                      <div className="flex flex-col items-center transition-all duration-500 group-hover:opacity-0">
                        <span className="text-3xl sm:text-4xl text-vermillion/30">✦</span>
                        <p className="mt-2 sm:mt-3 text-[9px] sm:text-xs uppercase tracking-[0.2em] text-warm-gray px-2 text-center">
                          {item.label}
                        </p>
                      </div>

                      {/* Hover state */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 px-4">
                        <p className="font-serif text-base sm:text-lg text-charcoal text-center">
                          {item.label}
                        </p>
                        <div className="mt-2 h-[1px] w-8 bg-vermillion" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              </AnimateOnScroll>
            ))}
          </div>

        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="flex items-center justify-center gap-3 my-4 sm:my-5">
        <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-[10px]">✦</span>
        <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* ─── Behind the Scenes Videos ─── */}
      <section className="bg-cream py-10 sm:py-12 md:py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="text-center mb-6 sm:mb-8">
            <div className="mx-auto h-[2px] w-[50px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
              Behind the Scenes
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
              See the Process
            </h2>
          </AnimateOnScroll>

          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {processClips.map((clip, i) => (
              <AnimateOnScroll key={clip.label} animation="fade-up" delay={i * 80}>
                <div className="group card-lift overflow-hidden border border-vermillion/10 bg-soft-white/50">
                  <div className="relative aspect-[9/16] overflow-hidden">
                    {clip.src ? (
                      <video
                        autoPlay muted loop playsInline preload="metadata"
                        poster={clip.src.replace(/\.mp4$/, ".jpg")}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      >
                        <source src={clip.src} type="video/mp4" />
                      </video>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cream-dark via-cream to-vermillion/5">
                        <span className="text-3xl text-vermillion/30">✦</span>
                        <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-warm-gray/60">
                          Coming soon
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">{clip.label}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* TODO: Replace with your Instagram handle */}
          <p className="mt-10 sm:mt-12 text-center text-sm text-charcoal-light">
            {t("gallery.ig.desc")}
          </p>
          <div className="mt-4 text-center">
            <a
              href="https://instagram.com/shimmyhands.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-vermillion-dark transition-colors hover:text-vermillion touch-target py-2 glow-pulse"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              {t("gallery.ig")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
