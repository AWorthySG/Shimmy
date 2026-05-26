"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-48 sm:bottom-20 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/80 text-soft-white transition-all duration-300 hover:bg-charcoal ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <span className="text-lg leading-none">↑</span>
    </button>
  );
}
