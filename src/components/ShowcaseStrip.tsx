"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "@/components/icons";

export type ShowcaseItem = { src: string; alt: string; caption: string; href: string };

/**
 * Full-width strip of tall photos that swipes on phones and scrolls with the
 * arrow buttons on larger screens. Native scroll-snap, so no carousel library.
 */
export default function ShowcaseStrip({ items, label }: { items: ShowcaseItem[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="relative" role="region" aria-label={label}>
      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 sm:gap-4 sm:scroll-px-6 sm:px-6"
      >
        {items.map((item, i) => (
          <li key={item.src} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[28%]">
            <Link href={item.href} className="group block">
              <div className="reveal-mask relative aspect-[3/4] overflow-hidden bg-cream-dark">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading={i < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 28vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-label text-warm-gray group-hover:text-vermillion-dark">
                {item.caption}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-6 hidden max-w-6xl justify-end gap-2 px-6 sm:flex">
        <button type="button" onClick={() => scrollBy(-1)} className="btn btn-outline btn-sm" aria-label="Previous photos">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => scrollBy(1)} className="btn btn-outline btn-sm" aria-label="Next photos">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
