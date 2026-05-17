"use client";

import { useEffect, useState } from "react";

export default function WelcomeBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("shimmy-visited")) {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("shimmy-visited", "true");
  };

  if (!show) return null;

  return (
    <div className="sticky top-0 z-[200] flex items-center justify-center bg-vermillion text-soft-white px-4 py-2 text-xs text-center min-h-[36px]">
      <p className="flex-1">
        First time here? Use code{" "}
        <span className="font-bold tracking-wider">WELCOME10</span> for $10 off
        your first purchase
      </p>
      <button
        onClick={dismiss}
        className="ml-4 shrink-0 text-soft-white/80 hover:text-soft-white transition-colors text-sm leading-none"
        aria-label="Dismiss banner"
      >
        &times;
      </button>
    </div>
  );
}
