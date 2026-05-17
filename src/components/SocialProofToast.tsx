"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const MESSAGES = [
  "Sarah booked Nano Brows — 2 hours ago",
  "Hui Ling purchased Sweater Weather — Baby Blue — 45 min ago",
  "Priya just booked Eyebrow Embroidery — 1 hour ago",
  "Nurul added Ingénue — Blush to bag — 30 min ago",
  "Amanda booked Ombre Powder Brows — 3 hours ago",
];

export default function SocialProofToast() {
  const [current, setCurrent] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const shownCountRef = useRef(0);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setCurrent(null), 400); // wait for slide-out animation
  }, []);

  useEffect(() => {
    // Don't show on mobile (< 640px)
    if (window.innerWidth < 640) return;

    const showNext = () => {
      if (shownCountRef.current >= 3) return;

      const msg = MESSAGES[indexRef.current % MESSAGES.length];
      indexRef.current += 1;
      shownCountRef.current += 1;

      setCurrent(msg);
      // Small delay so the DOM renders before we animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrent(null);
          // Schedule next notification after random 15-20s
          if (shownCountRef.current < 3) {
            const delay = 15000 + Math.random() * 5000;
            timerRef.current = setTimeout(showNext, delay);
          }
        }, 400);
      }, 4000);
    };

    // First notification after random 15-20 seconds
    const delay = 15000 + Math.random() * 5000;
    timerRef.current = setTimeout(showNext, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!current) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-[100] max-w-xs transition-all duration-400 hidden sm:block ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 border border-vermillion/15 bg-soft-white p-4 shadow-lg rounded">
        {/* Vermillion accent dot */}
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-vermillion" />
        <p className="flex-1 text-xs text-charcoal leading-relaxed">
          {current}
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 text-charcoal-light hover:text-charcoal transition-colors text-sm leading-none"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
