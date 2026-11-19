"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

type Animation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "blur-in";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const animationStyles: Record<Animation, { from: string; to: string }> = {
  "fade-up": {
    from: "opacity-0 translate-y-8",
    to: "opacity-100 translate-y-0",
  },
  "fade-down": {
    from: "opacity-0 -translate-y-8",
    to: "opacity-100 translate-y-0",
  },
  "fade-left": {
    from: "opacity-0 translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  "fade-right": {
    from: "opacity-0 -translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  "zoom-in": {
    from: "opacity-0 scale-95",
    to: "opacity-100 scale-100",
  },
  "blur-in": {
    from: "opacity-0 blur-sm",
    to: "opacity-100 blur-0",
  },
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function readReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = "",
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Read reduced motion after hydration, not in a useState initialiser: the server renders
  // "hidden", and a client-only initial value of "visible" left the hidden classes in the DOM
  // with no observer to reveal them, so reduced-motion visitors saw blank sections.
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const [inView, setInView] = useState(false);
  const isVisible = reducedMotion || inView;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, reducedMotion]);

  const { from, to } = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={`${reducedMotion ?"":"transition-all ease-out"}${isVisible ? to : from} ${className}`}
      style={reducedMotion ? undefined : { transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Stagger wrapper — applies incrementing delays to children.
 * Usage: <Stagger staggerMs={100}><Card /><Card /><Card /></Stagger>
 */
export function Stagger({
  children,
  staggerMs = 100,
  animation = "fade-up" as Animation,
  className = "",
}: {
  children: ReactNode[];
  staggerMs?: number;
  animation?: Animation;
  className?: string;
}) {
  return (
    <>
      {children.map((child, i) => (
        <AnimateOnScroll
          key={i}
          animation={animation}
          delay={i * staggerMs}
          className={className}
        >
          {child}
        </AnimateOnScroll>
      ))}
    </>
  );
}
