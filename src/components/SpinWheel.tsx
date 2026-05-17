"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const SEGMENTS = [
  "$5 Off",
  "$10 Off",
  "$15 Off",
  "Free Nail File",
  "$5 Off",
  "$10 Off",
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length; // 60 degrees each

export default function SpinWheel() {
  const [showTrigger, setShowTrigger] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const alreadySpunRef = useRef(false);

  useEffect(() => {
    if (localStorage.getItem("shimmy-spun")) {
      alreadySpunRef.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setShowTrigger(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
    setShowTrigger(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (result) {
      localStorage.setItem("shimmy-spun", "true");
    }
  }, [result]);

  const spin = useCallback(() => {
    if (spinning || result) return;
    setSpinning(true);

    // Random 3-5 full rotations + random offset
    const fullSpins = 3 + Math.random() * 2; // 3-5 spins
    const winIndex = Math.floor(Math.random() * SEGMENTS.length);
    // The wheel spins clockwise; the pointer is at top (0 degrees).
    // To land segment i at the top, the segment center should be at 0 degrees.
    // Segment i center is at i * 60 + 30 degrees from start.
    const segmentOffset = winIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const totalRotation = fullSpins * 360 + (360 - segmentOffset);

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(SEGMENTS[winIndex]);
      localStorage.setItem("shimmy-spun", "true");
    }, 3000);
  }, [spinning, result]);

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
        body: JSON.stringify({ email, prize: result }),
      });
    } catch {
      // silent
    }
    setSubmitted(true);
  };

  // Build conic gradient for wheel segments
  const conicStops = SEGMENTS.map((_, i) => {
    const color = i % 2 === 0 ? "var(--vermillion)" : "var(--gold)";
    const start = i * SEGMENT_ANGLE;
    const end = (i + 1) * SEGMENT_ANGLE;
    return `${color} ${start}deg ${end}deg`;
  }).join(", ");

  if (alreadySpunRef.current) return null;

  return (
    <>
      {/* Trigger pill button */}
      {showTrigger && (
        <button
          onClick={openModal}
          className="fixed bottom-6 left-6 z-[90] flex items-center gap-2 bg-vermillion text-soft-white px-4 py-2.5 rounded-full text-xs font-medium shadow-lg hover:bg-vermillion-dark transition-colors"
        >
          <span className="text-base">🎁</span>
          Spin for a Surprise
        </button>
      )}

      {/* Modal overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md bg-soft-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-charcoal-light hover:text-charcoal transition-colors text-xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <p className="font-serif text-xl text-charcoal">
                  You&rsquo;re all set!
                </p>
                <p className="mt-2 text-sm text-charcoal-light">
                  Check your inbox for your {result} code.
                </p>
              </div>
            ) : result ? (
              <div className="text-center">
                <p className="font-serif text-2xl text-charcoal">
                  You won {result}!
                </p>
                <p className="mt-2 text-sm text-charcoal-light">
                  Enter your email to claim:
                </p>
                <div className="mt-4 flex flex-col gap-3">
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
                    Claim My Prize
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-serif text-xl text-charcoal mb-6">
                  Spin to Win!
                </p>

                {/* Wheel container */}
                <div className="relative mx-auto w-64 h-64">
                  {/* Pointer (top center) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-charcoal" />

                  {/* Wheel */}
                  <div
                    className="w-64 h-64 rounded-full relative overflow-hidden"
                    style={{
                      background: `conic-gradient(${conicStops})`,
                      opacity: 0.15,
                      transform: `rotate(${rotation}deg)`,
                      transition: spinning
                        ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                        : "none",
                    }}
                  />

                  {/* Segment labels overlaid on the wheel */}
                  <div
                    className="absolute inset-0 w-64 h-64"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: spinning
                        ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                        : "none",
                    }}
                  >
                    {SEGMENTS.map((seg, i) => {
                      const angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
                      return (
                        <div
                          key={i}
                          className="absolute top-1/2 left-1/2 text-[10px] font-bold text-charcoal uppercase tracking-wider"
                          style={{
                            transform: `rotate(${angle}deg) translateY(-80px)`,
                            transformOrigin: "0 0",
                            width: 0,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              transform: "translateX(-50%)",
                            }}
                          >
                            {seg}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Center SPIN button */}
                  <button
                    onClick={spin}
                    disabled={spinning}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-vermillion text-soft-white text-xs font-bold uppercase tracking-wider hover:bg-vermillion-dark transition-colors disabled:opacity-50 z-10"
                  >
                    SPIN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
