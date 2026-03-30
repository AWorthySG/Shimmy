"use client";

import { useState, useCallback, type ReactNode } from "react";
import { NailIntro } from "./nail-intro";

/**
 * Wraps the nails page content with the nail painting intro animation.
 * Shows the intro on first visit, then reveals the page beneath.
 */
export function NailsWithIntro({ children }: { children: ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  const handleComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <NailIntro onComplete={handleComplete} />}
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
