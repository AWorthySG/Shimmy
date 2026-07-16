"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { BrowIntro } from "./brow-intro";

const INTRO_KEY = "shimmy-brow-intro-seen";

/**
 * Wraps the home page content with the brow embroidery intro animation.
 * Shows the intro on the first visit of a session, then reveals the page
 * beneath. Returning visitors (and anyone with reduced-motion preferences)
 * skip straight to the content — no repeated 2s blank on every visit.
 */
export function HomeWithIntro({ children }: { children: ReactNode }) {
  // Start true so SSR and the first client render match (no hydration
  // mismatch); the effect below immediately skips it when appropriate.
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_KEY);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (seen || reducedMotion) setShowIntro(false);
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <BrowIntro onComplete={handleComplete} />}
      <div
        className={`transition-opacity duration-300 ${
          showIntro ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}
