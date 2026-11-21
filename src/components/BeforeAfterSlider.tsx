"use client";

import Image from "next/image";
import { useState } from "react";
import { clampPercent } from "@/lib/slider";
import { DragHorizontal } from "@/components/icons";

type Props = {
  /**
   * One photo with the "before" shot on its top half and the "after" shot on
   * its bottom half. The frame shows one half at a time.
   */
  src: string;
  width: number;
  height: number;
  alt: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

/**
 * Drag-to-compare slider. A full-size range input sits over the photo, so it
 * works with a mouse, a finger or the arrow keys, and screen readers announce
 * the position.
 */
export default function BeforeAfterSlider({
  src,
  width,
  height,
  alt,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: Props) {
  const [pos, setPos] = useState(50);
  // The frame matches one half of the photo.
  const ratio = `${width} / ${height / 2}`;
  const half = (top: boolean) => (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, 640px"
      className="absolute left-0 w-full max-w-none select-none"
      style={{ height: "200%", top: top ? 0 : "-100%" }}
      draggable={false}
    />
  );

  return (
    <figure className={`relative overflow-hidden bg-cream-dark ${className}`} style={{ aspectRatio: ratio }}>
      {half(false)}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {half(true)}
      </div>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-on-scrim shadow-sm" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-on-scrim bg-scrim/40 text-on-scrim backdrop-blur-sm">
          <DragHorizontal className="h-[18px] w-[18px]" />
        </span>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 bg-scrim/60 px-2 py-1 text-[10px] uppercase tracking-label text-on-scrim">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-scrim/60 px-2 py-1 text-[10px] uppercase tracking-label text-on-scrim">
        {afterLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(clampPercent(Number(e.target.value)))}
        aria-label={`${alt}: drag to compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none opacity-0"
        style={{ touchAction: "pan-y" }}
      />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
