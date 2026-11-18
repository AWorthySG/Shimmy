"use client";

import Image from "next/image";

import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";


// Real client results already in public/images/brows (each image shows the
// before and after side by side). Technique names are not shown because the
// photos are not labelled with the technique used.
const GALLERY_IMAGES = [
  "/images/brows/brow-before-after-1.jpg",
  "/images/brows/brow-before-after-2.jpg",
  "/images/brows/brow-before-after-closeup.jpg",
  "/images/brows/brow-before-after-split.jpg",
  "/images/brows/brow-before-after-mens.jpg",
];

export default function TryOnGallery() {
  const { t } = useI18n();

  return (
    <section className="bg-cream-dark py-14 sm:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll animation="fade-up" className="text-center">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="eyebrow">
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
            {GALLERY_IMAGES.map((src) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden border border-vermillion/15 bg-cream/60">
                <Image
                  src={src}
                  alt={`${t("tryon.gallery.before")} / ${t("tryon.gallery.after")}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
