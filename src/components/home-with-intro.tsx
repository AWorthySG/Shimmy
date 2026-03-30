"use client";

import { useState, useCallback, type ReactNode } from "react";
import { BrowIntro } from "./brow-intro";

/**
 * Wraps the home page content with the brow embroidery intro animation.
 * Shows the intro on first visit, then reveals the page beneath.
 */
export function HomeWithIntro({ children }: { children: ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  const handleComplete = useCallback(() => {
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
