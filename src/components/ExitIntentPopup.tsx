"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const readyRef = useRef(false);
  const hasHoverRef = useRef(false);

  useEffect(() => {
    // Don't render on touch-only devices (no mouse)
    if (!window.matchMedia("(hover: hover)").matches) return;
    hasHoverRef.current = true;

    // Already shown this session
    if (sessionStorage.getItem("shimmy-exit-shown")) return;

    // Wait 5 seconds before activating
    const timer = setTimeout(() => {
      readyRef.current = true;
    }, 5000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (!readyRef.current) return;
      if (e.clientY < 10) {
        sessionStorage.setItem("shimmy-exit-shown", "true");
        setVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // silent
    }
    setSubmitted(true);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-soft-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X */}
        <button
          onClick={close}
          className="absolute top-3 right-3 text-charcoal-light hover:text-charcoal transition-colors text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <p className="font-serif text-xl text-charcoal">
              Check your inbox!
            </p>
            <p className="mt-2 text-sm text-charcoal-light">
              Your $10 discount code is on its way.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl text-charcoal text-center">
              Wait &mdash; here&rsquo;s $10 off
            </h2>
            <p className="mt-3 text-sm text-charcoal-light text-center leading-relaxed">
              Enter your email and we&rsquo;ll send you a $10 discount code for
              your first purchase.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="border border-vermillion/20 bg-soft-white px-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-vermillion/50 transition-colors w-full"
              />
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <button
                onClick={handleSubmit}
                className="bg-vermillion text-soft-white px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-vermillion-dark transition-colors w-full"
              >
                Claim My $10
              </button>
            </div>

            <button
              onClick={close}
              className="block mx-auto mt-4 text-xs text-charcoal-light hover:text-charcoal transition-colors underline"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
