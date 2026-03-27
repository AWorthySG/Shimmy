"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already visible (reduced motion)
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, isVisible]);

  const { from, to } = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${isVisible ? to : from} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
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
