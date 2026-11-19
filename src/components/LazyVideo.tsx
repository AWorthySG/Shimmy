"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
  /** Above-the-fold hero: start once the page has finished loading. Default: load when scrolled near. */
  eager?: boolean;
};

/**
 * Muted looping background clip that downloads only when it is about to be
 * seen, pauses when scrolled away, and stays on its poster for visitors who
 * ask for reduced motion or data saving.
 */
function afterPageLoad(fn: () => void) {
  const run = () => setTimeout(fn, 300);
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}

export default function LazyVideo({ src, poster, className, style, eager = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const stillOnlyRef = useRef(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true;
    stillOnlyRef.current = reduceMotion || saveData;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          // A hero clip waits for the page load so the poster, not the video
          // download, is what the visitor sees first.
          if (eager) afterPageLoad(() => setActive(true));
          else setActive(true);
          if (!stillOnlyRef.current && video.currentSrc) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [eager]);

  // Start playback once the source has been attached, if the clip is on screen.
  useEffect(() => {
    const video = ref.current;
    if (active && video && visibleRef.current && !stillOnlyRef.current) {
      video.play().catch(() => {});
    }
  }, [active]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload={active ? "auto" : "none"}
      poster={poster}
      src={active ? src : undefined}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
