"use client";

import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";

interface GalleryItem {
  before: string;
  after: string;
  styleNameKey: string;
}

// Six cards, cycling through the 3 sample image pairs that already exist
// under public/images/results/. If the files are missing we render a
// stylised placeholder slot (same approach as BeforeAfterCard).
const GALLERY_ITEMS: GalleryItem[] = [
  {
    before: "/images/results/before-1.jpg",
    after: "/images/results/after-1.jpg",
    styleNameKey: "tryon.style.nano-soft",
  },
  {
    before: "/images/results/before-2.jpg",
    after: "/images/results/after-2.jpg",
    styleNameKey: "tryon.style.ombre-light",
  },
  {
    before: "/images/results/before-3.jpg",
    after: "/images/results/after-3.jpg",
    styleNameKey: "tryon.style.embroidery-classic",
  },
  {
    before: "/images/results/before-1.jpg",
    after: "/images/results/after-1.jpg",
    styleNameKey: "tryon.style.nano-defined",
  },
  {
    before: "/images/results/before-2.jpg",
    after: "/images/results/after-2.jpg",
    styleNameKey: "tryon.style.microblading-feathered",
  },
  {
    before: "/images/results/before-3.jpg",
    after: "/images/results/after-3.jpg",
    styleNameKey: "tryon.style.ombre-bold",
  },
];

function PlaceholderSlot({ tag, src }: { tag: string; src: string }) {
  return (
    <div className="flex-1 relative aspect-[4/5] bg-gradient-to-br from-cream-dark/60 via-cream to-vermillion/5 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={tag}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        // If the asset is missing we silently fall back to the gradient.
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-4">
          <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-2" />
          <p className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/40">
            {tag}
          </p>
          <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-2" />
        </div>
      </div>
      <span className="absolute bottom-2 left-2 bg-charcoal/60 text-soft-white text-[10px] uppercase tracking-[0.15em] px-2 py-1">
        {tag}
      </span>
    </div>
  );
}

export default function TryOnGallery() {
  const { t } = useI18n();

  return (
    <section className="bg-cream-dark py-14 sm:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll animation="fade-up" className="text-center">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
            {t("tryon.gallery.title")}
          </p>
          <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t("tryon.gallery.title")}
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm sm:text-base text-charcoal-light">
            {t("tryon.gallery.subtitle")}
          </p>
        </AnimateOnScroll>

        <div className="mt-10 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
          <Stagger staggerMs={120} animation="fade-up">
            {GALLERY_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="border border-vermillion/15 bg-cream/60 overflow-hidden"
              >
                <div className="flex gap-[2px]">
                  <PlaceholderSlot
                    tag={t("tryon.gallery.before")}
                    src={item.before}
                  />
                  <PlaceholderSlot
                    tag={t("tryon.gallery.after")}
                    src={item.after}
                  />
                </div>
                <p className="text-center text-sm text-charcoal py-3 font-serif">
                  {t(item.styleNameKey)}
                </p>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
