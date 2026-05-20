"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface Story {
  label: string;
  image: string;
  color: "vermillion" | "gold" | "jade";
}

const STORIES: Story[] = [
  { label: "New", image: "/images/nails/ingenue-1.jpg", color: "vermillion" },
  {
    label: "Process",
    image: "/images/nails/sweater-flatlay-1.jpg",
    color: "gold",
  },
  {
    label: "Results",
    image: "/images/nails/lovers-flatlay-5.jpg",
    color: "jade",
  },
  {
    label: "Reviews",
    image: "/images/testimonials/hui-ling-portrait.jpg",
    color: "vermillion",
  },
];

const RING_COLORS: Record<string, string> = {
  vermillion: "ring-vermillion",
  gold: "ring-gold",
  jade: "ring-jade",
};

export default function Stories() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape key to close overlay
  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  // Auto-focus close button when overlay opens
  useEffect(() => {
    if (activeIndex !== null) {
      closeButtonRef.current?.focus();
    }
  }, [activeIndex]);

  return (
    <>
      {/* Story bubbles */}
      <div className="flex items-center justify-center gap-4 overflow-x-auto py-2 px-4">
        {STORIES.map((story, i) => (
          <button
            key={story.label}
            onClick={() => setActiveIndex(i)}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div
              className={`relative w-16 h-16 rounded-full ring-2 ${RING_COLORS[story.color]} overflow-hidden`}
            >
              <Image
                src={story.image}
                alt={story.label}
                fill
                className="object-cover rounded-full"
                sizes="64px"
              />
            </div>
            <span className="text-[9px] uppercase tracking-wider text-charcoal-light">
              {story.label}
            </span>
          </button>
        ))}
      </div>

      {/* Full-screen overlay */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/90"
          onClick={() => setActiveIndex(null)}
        >
          <button
            ref={closeButtonRef}
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 text-soft-white text-3xl leading-none z-10 hover:text-soft-white/80 transition-colors"
            aria-label="Close story"
          >
            &times;
          </button>
          <div
            className="relative w-full max-w-lg aspect-[3/4] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={STORIES[activeIndex].image}
              alt={STORIES[activeIndex].label}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 512px"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
