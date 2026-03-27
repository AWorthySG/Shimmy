"use client";

import { useState, useEffect } from "react";

/**
 * Full-screen intro — Chinese floral beauty theme.
 *
 * Phases (4 seconds total):
 *   1. BLOOM     (0–1.2s)  — Peony & plum blossoms bloom open around the canvas
 *   2. STROKES   (0.6–2.4s) — Brow strokes draw in calligraphically, emerging among flowers
 *   3. PETALS    (0.4–3.2s) — Many petals drift and float across the scene
 *   4. BRANDING  (2.4–3.4s) — Brand name fades in
 *   5. FADING    (3.4–4.0s) — Scene fades to page
 */
export function BrowIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"drawing" | "branding" | "fading">("drawing");

  useEffect(() => {
    const brandTimer = setTimeout(() => setPhase("branding"), 2400);
    const fadeTimer = setTimeout(() => setPhase("fading"), 3400);
    const completeTimer = setTimeout(() => onComplete(), 4000);
    return () => {
      clearTimeout(brandTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  type Stroke = [string, number, number, number, string, number];

  const strokes: Stroke[] = [
    // PHASE 1: MAPPING
    ["M 78 158 C 95 152, 125 138, 165 122 C 200 108, 245 92, 290 82 C 335 72, 380 70, 415 76 C 430 80, 440 86, 446 92", 0.8, 0.06, 0.0, "map", 1.0],
    ["M 108 136 C 130 112, 168 80, 218 62 C 258 48, 310 46, 355 52 C 385 58, 412 68, 438 84", 0.8, 0.06, 0.15, "map", 1.0],
    ["M 180 96 C 220 72, 270 56, 320 52 C 350 50, 380 56, 400 66", 0.5, 0.04, 0.25, "map", 0.8],

    // PHASE 2: BASE LAYER
    ["M 88 156 C 90 144, 94 130, 100 118 C 104 110, 108 104, 112 98", 1.4, 0.25, 0.5, "base", 0.4],
    ["M 96 154 C 99 142, 104 128, 110 116 C 115 108, 120 100, 126 94", 1.6, 0.2, 0.56, "base", 0.4],
    ["M 104 150 C 108 136, 114 122, 122 110 C 126 102, 132 96, 138 90", 1.5, 0.22, 0.62, "base", 0.4],
    ["M 114 146 C 118 132, 126 116, 136 104 C 140 96, 146 90, 152 84", 1.4, 0.2, 0.68, "base", 0.4],
    ["M 128 138 C 136 122, 148 104, 162 90 C 168 82, 176 76, 184 70", 1.6, 0.22, 0.74, "base", 0.45],
    ["M 144 128 C 154 112, 168 96, 184 82 C 190 76, 198 72, 206 68", 1.5, 0.2, 0.8, "base", 0.45],
    ["M 162 118 C 174 104, 190 88, 208 76 C 216 70, 224 66, 232 64", 1.4, 0.22, 0.86, "base", 0.45],
    ["M 180 108 C 194 94, 212 80, 230 70 C 238 66, 246 62, 254 60", 1.5, 0.2, 0.92, "base", 0.45],
    ["M 200 96 C 216 84, 234 72, 252 64 C 262 60, 272 58, 280 56", 1.6, 0.22, 0.98, "base", 0.45],
    ["M 224 84 C 240 76, 258 66, 276 60 C 286 56, 296 56, 306 56", 1.4, 0.2, 1.04, "base", 0.45],
    ["M 258 72 C 280 66, 304 60, 326 58 C 344 56, 360 58, 374 62", 1.3, 0.18, 1.1, "base", 0.4],
    ["M 290 64 C 316 60, 340 58, 362 60 C 378 62, 390 66, 400 72", 1.2, 0.15, 1.16, "base", 0.4],
    ["M 120 142 C 160 112, 220 78, 300 64 C 360 56, 400 66, 430 84", 3.0, 0.03, 0.6, "blush", 0.8],

    // PHASE 3: DETAIL
    ["M 86 157 C 88 146, 92 132, 98 120 C 102 112, 106 106, 110 100", 0.9, 0.8, 1.2, "ink", 0.3],
    ["M 93 154 C 96 142, 100 128, 106 116 C 110 108, 115 100, 120 94", 1.0, 0.85, 1.26, "ink", 0.3],
    ["M 100 152 C 104 138, 110 124, 118 112 C 122 104, 128 96, 134 90", 1.05, 0.82, 1.32, "ink", 0.3],
    ["M 90 156 C 93 146, 97 134, 103 124 C 107 116, 112 108, 116 102", 0.6, 0.5, 1.36, "warm", 0.3],
    ["M 108 148 C 112 134, 120 118, 128 106 C 133 98, 138 92, 144 86", 1.0, 0.8, 1.38, "ink", 0.3],
    ["M 116 142 C 120 130, 128 116, 136 104 C 141 96, 146 90, 152 84", 1.05, 0.78, 1.44, "ink", 0.3],
    ["M 126 136 C 134 120, 146 104, 160 90 C 166 82, 174 76, 182 70", 1.1, 0.85, 1.48, "ink", 0.32],
    ["M 140 128 C 148 114, 162 98, 176 84 C 182 78, 190 72, 198 68", 0.95, 0.72, 1.52, "warm", 0.32],
    ["M 152 120 C 162 106, 176 90, 192 78 C 198 72, 206 68, 214 64", 1.1, 0.82, 1.56, "ink", 0.32],
    ["M 164 114 C 174 100, 190 86, 206 74 C 214 70, 222 66, 230 62", 1.0, 0.78, 1.62, "ink", 0.32],
    ["M 176 106 C 188 94, 204 80, 220 70 C 228 66, 236 62, 244 60", 1.1, 0.82, 1.68, "ink", 0.32],
    ["M 188 100 C 200 88, 216 76, 232 66 C 240 62, 248 60, 256 58", 0.9, 0.7, 1.72, "warm", 0.3],
    ["M 200 94 C 214 82, 232 70, 250 62 C 258 58, 268 56, 276 54", 1.15, 0.88, 1.76, "ink", 0.3],
    ["M 226 82 C 240 74, 258 66, 276 58 C 284 56, 294 54, 302 54", 1.1, 0.82, 1.86, "ink", 0.3],
    ["M 260 70 C 280 64, 302 58, 324 56 C 340 56, 354 58, 366 62", 0.95, 0.7, 1.94, "ink", 0.3],
    ["M 300 60 C 320 58, 342 56, 360 58 C 374 62, 386 66, 396 72", 0.7, 0.5, 2.02, "ink", 0.28],
    ["M 354 60 C 370 64, 384 68, 396 74 C 404 78, 410 82, 416 86", 0.4, 0.3, 2.1, "warm", 0.24],
    ["M 380 68 C 392 72, 404 78, 414 84 C 420 88, 426 90, 430 92", 0.3, 0.22, 2.14, "fine", 0.22],

    // PHASE 4: WISPS
    ["M 82 160 C 84 152, 86 142, 90 134 C 93 128, 96 122, 100 118", 0.35, 0.2, 2.0, "fine", 0.3],
    ["M 108 142 C 112 132, 118 120, 124 110 C 128 104, 132 98, 136 94", 0.3, 0.18, 2.06, "fine", 0.28],
    ["M 132 134 C 138 122, 146 108, 156 96 C 160 90, 166 84, 172 80", 0.3, 0.16, 2.12, "fine", 0.26],
    ["M 398 74 C 408 78, 416 82, 422 86 C 428 90, 432 92, 436 94", 0.25, 0.16, 2.18, "fine", 0.22],
    ["M 420 86 C 426 88, 432 92, 436 94 C 440 96, 442 98, 444 100", 0.2, 0.12, 2.22, "fine", 0.2],
  ];

  const colorMap: Record<string, string> = {
    map:   "var(--gold-light)",
    base:  "var(--warm-gray)",
    ink:   "var(--charcoal)",
    warm:  "var(--gold-dark)",
    fine:  "var(--gold)",
    blush: "var(--vermillion)",
  };

  /* ── Peony blooms (牡丹) — layered petals that bloom open ── */
  const peonies = [
    { cx: 60,  cy: 100, size: 28, delay: 0.1, petals: 8,  color: "var(--vermillion)" },
    { cx: 470, cy: 70,  size: 24, delay: 0.3, petals: 7,  color: "var(--vermillion-light)" },
    { cx: 30,  cy: 50,  size: 18, delay: 0.5, petals: 6,  color: "var(--vermillion)" },
    { cx: 490, cy: 140, size: 20, delay: 0.6, petals: 6,  color: "var(--vermillion)" },
    { cx: 460, cy: 180, size: 14, delay: 0.9, petals: 5,  color: "var(--vermillion-light)" },
    { cx: 15,  cy: 160, size: 16, delay: 0.7, petals: 5,  color: "var(--vermillion-light)" },
  ];

  /* ── Plum blossoms (梅花) — five-petal flowers on branches ── */
  const plumBlossoms = [
    { cx: 45,  cy: 30,  size: 7,  delay: 0.2 },
    { cx: 75,  cy: 55,  size: 5,  delay: 0.4 },
    { cx: 35,  cy: 75,  size: 6,  delay: 0.6 },
    { cx: 480, cy: 25,  size: 6,  delay: 0.35 },
    { cx: 500, cy: 55,  size: 5,  delay: 0.55 },
    { cx: 455, cy: 45,  size: 4,  delay: 0.75 },
    { cx: 490, cy: 100, size: 5,  delay: 0.85 },
    { cx: 20,  cy: 130, size: 5,  delay: 0.95 },
  ];

  /* ── Drifting petals — many, at different sizes/speeds/angles ── */
  const driftingPetals = [
    { x: 80,   y: -10,  size: 5,  delay: 0.3,  dur: 3.2, drift: 35,  rot: 180 },
    { x: 160,  y: -20,  size: 4,  delay: 0.6,  dur: 2.8, drift: -25, rot: 220 },
    { x: 250,  y: -15,  size: 6,  delay: 0.4,  dur: 3.5, drift: 20,  rot: 160 },
    { x: 340,  y: -10,  size: 3.5,delay: 0.8,  dur: 2.6, drift: -30, rot: 200 },
    { x: 420,  y: -20,  size: 5,  delay: 0.5,  dur: 3.0, drift: 15,  rot: 240 },
    { x: 120,  y: -5,   size: 3,  delay: 1.0,  dur: 2.4, drift: 28,  rot: 150 },
    { x: 200,  y: -25,  size: 4.5,delay: 1.2,  dur: 3.3, drift: -18, rot: 190 },
    { x: 300,  y: -8,   size: 3,  delay: 1.4,  dur: 2.5, drift: 22,  rot: 210 },
    { x: 380,  y: -18,  size: 4,  delay: 0.9,  dur: 2.9, drift: -20, rot: 170 },
    { x: 480,  y: -12,  size: 3.5,delay: 1.1,  dur: 2.7, drift: 30,  rot: 230 },
    { x: 50,   y: -8,   size: 4,  delay: 1.5,  dur: 3.1, drift: 18,  rot: 200 },
    { x: 440,  y: -15,  size: 5,  delay: 1.3,  dur: 2.8, drift: -15, rot: 180 },
    { x: 180,  y: -22,  size: 2.5,delay: 1.6,  dur: 2.3, drift: 25,  rot: 250 },
    { x: 520,  y: -10,  size: 3,  delay: 0.7,  dur: 3.0, drift: -22, rot: 195 },
    { x: 10,   y: -18,  size: 3.5,delay: 1.8,  dur: 2.6, drift: 32,  rot: 175 },
    { x: 270,  y: -5,   size: 4,  delay: 2.0,  dur: 2.2, drift: -12, rot: 215 },
  ];

  /* ── Branch paths (plum tree branches) ── */
  const branches = [
    // Left branch cluster
    { d: "M -10 180 C 10 150, 30 110, 45 80 C 55 60, 60 40, 55 20", delay: 0.0, dur: 1.2 },
    { d: "M 45 80 C 55 70, 70 60, 80 55", delay: 0.3, dur: 0.6 },
    { d: "M 35 110 C 40 100, 50 85, 55 75", delay: 0.4, dur: 0.5 },
    // Right branch cluster
    { d: "M 530 200 C 510 160, 495 120, 485 80 C 478 55, 475 35, 480 15", delay: 0.1, dur: 1.2 },
    { d: "M 485 80 C 475 70, 460 55, 450 45", delay: 0.35, dur: 0.6 },
    { d: "M 495 120 C 500 105, 505 90, 500 80", delay: 0.45, dur: 0.5 },
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-600 ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 40%, var(--soft-white) 0%, var(--cream) 55%, var(--cream-dark) 100%)",
      }}
    >
      {/* Subtle warm atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "600px", height: "600px", background: "radial-gradient(circle, var(--vermillion-light) 0%, transparent 70%)", opacity: 0.04 }}
        />
        <div
          className="absolute top-1/4 left-1/4 rounded-full"
          style={{ width: "300px", height: "300px", background: "radial-gradient(circle, var(--vermillion) 0%, transparent 70%)", opacity: 0.02 }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 rounded-full"
          style={{ width: "250px", height: "250px", background: "radial-gradient(circle, var(--gold-light) 0%, transparent 70%)", opacity: 0.03 }}
        />
      </div>

      {/* Main SVG canvas */}
      <div className="relative w-[300px] h-[170px] sm:w-[420px] sm:h-[230px] md:w-[540px] md:h-[280px]">
        <svg
          viewBox="-10 -10 540 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* ── Plum tree branches ── */}
          {branches.map((b, i) => (
            <path
              key={`branch-${i}`}
              d={b.d}
              stroke="var(--charcoal)"
              strokeWidth={1.2 - i * 0.1}
              strokeLinecap="round"
              fill="none"
              opacity="0.12"
              className="branch-stroke"
              style={{
                strokeDasharray: 300,
                strokeDashoffset: 300,
                animation: `drawBranch ${b.dur}s ease-out ${b.delay}s forwards`,
              }}
            />
          ))}

          {/* ── Peony blooms (牡丹) — layered petal circles ── */}
          {peonies.map((p, pi) => (
            <g key={`peony-${pi}`} className="peony-bloom" style={{ animation: `bloomOpen 1.2s ease-out ${p.delay}s both` }}>
              {Array.from({ length: p.petals }).map((_, i) => {
                const angle = (360 / p.petals) * i;
                const rad = (angle * Math.PI) / 180;
                const px = p.cx + Math.cos(rad) * p.size * 0.35;
                const py = p.cy + Math.sin(rad) * p.size * 0.35;
                const innerAngle = angle + 25;
                const innerRad = (innerAngle * Math.PI) / 180;
                const ipx = p.cx + Math.cos(innerRad) * p.size * 0.18;
                const ipy = p.cy + Math.sin(innerRad) * p.size * 0.18;
                return (
                  <g key={i}>
                    {/* Outer petal */}
                    <ellipse
                      cx={px} cy={py}
                      rx={p.size * 0.4} ry={p.size * 0.25}
                      fill={p.color}
                      opacity={0.15 + (i % 3) * 0.03}
                      transform={`rotate(${angle} ${px} ${py})`}
                    />
                    {/* Inner petal layer */}
                    <ellipse
                      cx={ipx} cy={ipy}
                      rx={p.size * 0.25} ry={p.size * 0.15}
                      fill={p.color}
                      opacity={0.2 + (i % 2) * 0.05}
                      transform={`rotate(${innerAngle} ${ipx} ${ipy})`}
                    />
                  </g>
                );
              })}
              {/* Center dot (花蕊 stamen) */}
              <circle cx={p.cx} cy={p.cy} r={p.size * 0.08} fill="var(--gold)" opacity="0.4" />
              <circle cx={p.cx} cy={p.cy} r={p.size * 0.04} fill="var(--gold-dark)" opacity="0.5" />
            </g>
          ))}

          {/* ── Plum blossoms (梅花) — classic five-petal flowers ── */}
          {plumBlossoms.map((b, bi) => (
            <g key={`plum-${bi}`} className="plum-bloom" style={{ animation: `bloomOpen 0.8s ease-out ${b.delay}s both` }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (360 / 5) * i - 90;
                const rad = (angle * Math.PI) / 180;
                const px = b.cx + Math.cos(rad) * b.size * 0.5;
                const py = b.cy + Math.sin(rad) * b.size * 0.5;
                return (
                  <ellipse
                    key={i}
                    cx={px} cy={py}
                    rx={b.size * 0.35} ry={b.size * 0.28}
                    fill="var(--vermillion-light)"
                    opacity={0.25}
                    transform={`rotate(${angle} ${px} ${py})`}
                  />
                );
              })}
              <circle cx={b.cx} cy={b.cy} r={b.size * 0.12} fill="var(--gold)" opacity="0.5" />
            </g>
          ))}

          {/* ── Drifting petals (花瓣飘落) ── */}
          {driftingPetals.map((p, i) => (
            <g key={`drift-${i}`}>
              {/* Each petal is a curved teardrop shape */}
              <path
                d={`M ${p.x} ${p.y}
                    c ${p.size * 0.6} ${-p.size * 0.4}, ${p.size * 1.2} ${-p.size * 0.2}, ${p.size * 1.5} ${p.size * 0.2}
                    c ${p.size * 0.2} ${p.size * 0.5}, ${-p.size * 0.3} ${p.size * 1.0}, ${-p.size * 0.8} ${p.size * 1.1}
                    c ${-p.size * 0.6} ${p.size * 0.1}, ${-p.size * 1.0} ${-p.size * 0.3}, ${-p.size * 0.7} ${-p.size * 1.3}`}
                fill="var(--vermillion)"
                opacity="0"
                style={{
                  animation: `petalFall ${p.dur}s ease-in-out ${p.delay}s forwards`,
                  transformOrigin: `${p.x}px ${p.y}px`,
                  ["--pDrift" as string]: `${p.drift}px`,
                  ["--pRot" as string]: `${p.rot}deg`,
                }}
              />
              {/* Petal vein — tiny line for detail */}
              <line
                x1={p.x + p.size * 0.3}
                y1={p.y - p.size * 0.1}
                x2={p.x + p.size * 0.5}
                y2={p.y + p.size * 0.6}
                stroke="var(--vermillion-dark)"
                strokeWidth="0.3"
                opacity="0"
                style={{
                  animation: `petalFall ${p.dur}s ease-in-out ${p.delay}s forwards`,
                  transformOrigin: `${p.x}px ${p.y}px`,
                  ["--pDrift" as string]: `${p.drift}px`,
                  ["--pRot" as string]: `${p.rot}deg`,
                }}
              />
            </g>
          ))}

          {/* ── Brow embroidery strokes ── */}
          {strokes.map(([d, width, opacity, delay, colorKey, dur], i) => (
            <path
              key={`stroke-${i}`}
              d={d}
              stroke={colorMap[colorKey]}
              strokeWidth={width}
              strokeLinecap="round"
              strokeOpacity={opacity}
              fill="none"
              className="brow-hair"
              style={{
                strokeDasharray: 400,
                strokeDashoffset: 400,
                animation: `drawHair ${dur}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s forwards`,
              }}
            />
          ))}

          {/* Soft shadow beneath brow */}
          <ellipse
            cx="265" cy="168" rx="175" ry="5"
            fill="var(--warm-gray)" opacity="0"
            className="brow-shadow"
          />

          {/* ── Scattered leaf accents ── */}
          <path d="M 50 185 C 55 180, 65 178, 72 182 C 65 186, 55 188, 50 185" fill="var(--jade)" opacity="0" style={{ animation: "leafAppear 0.6s ease-out 1.0s forwards" }} />
          <path d="M 470 190 C 475 184, 485 182, 492 186 C 485 190, 475 192, 470 190" fill="var(--jade)" opacity="0" style={{ animation: "leafAppear 0.6s ease-out 1.2s forwards" }} />
          <path d="M 25 95 C 30 88, 40 86, 48 90 C 40 94, 30 96, 25 95" fill="var(--jade-light)" opacity="0" style={{ animation: "leafAppear 0.6s ease-out 0.8s forwards" }} />
          <path d="M 500 160 C 505 154, 513 152, 518 156 C 513 160, 505 162, 500 160" fill="var(--jade-light)" opacity="0" style={{ animation: "leafAppear 0.6s ease-out 1.4s forwards" }} />
        </svg>
      </div>

      {/* Brand reveal */}
      <div
        className={`mt-6 sm:mt-8 text-center transition-all duration-800 ease-out ${
          phase === "branding" || phase === "fading"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5"
        }`}
      >
        {/* Floral ornament divider */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className={`h-[0.5px] bg-gradient-to-r from-transparent to-vermillion/30 transition-all duration-800 ease-out ${phase === "branding" || phase === "fading" ? "w-12" : "w-0"}`} />
          <span className={`text-vermillion/40 text-[10px] transition-opacity duration-600 ${phase === "branding" || phase === "fading" ? "opacity-100" : "opacity-0"}`}>
            ❀
          </span>
          <span className={`text-gold/30 text-[7px] transition-opacity duration-600 delay-100 ${phase === "branding" || phase === "fading" ? "opacity-100" : "opacity-0"}`}>
            ✿
          </span>
          <span className={`text-vermillion/40 text-[10px] transition-opacity duration-600 ${phase === "branding" || phase === "fading" ? "opacity-100" : "opacity-0"}`}>
            ❀
          </span>
          <div className={`h-[0.5px] bg-gradient-to-l from-transparent to-vermillion/30 transition-all duration-800 ease-out ${phase === "branding" || phase === "fading" ? "w-12" : "w-0"}`} />
        </div>

        <p className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] text-charcoal">
          Shimmybrows
        </p>
        <p className="mt-2 text-[8px] sm:text-[9px] uppercase tracking-[0.5em] text-warm-gray">
          Brow Artistry
        </p>

        {/* Seal mark 眉 */}
        <div className={`mx-auto mt-3 flex h-6 w-6 items-center justify-center border border-vermillion/30 transition-all duration-600 delay-200 ${
          phase === "branding" || phase === "fading" ? "opacity-50 scale-100" : "opacity-0 scale-75"
        }`}>
          <span className="font-serif text-[8px] text-vermillion/50">眉</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drawHair {
          0% { stroke-dashoffset: 400; opacity: 0; }
          8% { opacity: 0.5; }
          30% { opacity: 0.85; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes drawBranch {
          0% { stroke-dashoffset: 300; opacity: 0; }
          15% { opacity: 0.12; }
          100% { stroke-dashoffset: 0; opacity: 0.12; }
        }

        @keyframes bloomOpen {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes petalFall {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.4);
          }
          10% { opacity: 0.2; }
          30% { opacity: 0.18; }
          60% {
            opacity: 0.12;
            transform: translateY(100px) translateX(var(--pDrift, 20px)) rotate(var(--pRot, 180deg)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(260px) translateX(calc(var(--pDrift, 20px) * 1.6)) rotate(calc(var(--pRot, 180deg) * 1.5)) scale(0.6);
          }
        }

        @keyframes leafAppear {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0.12; transform: scale(1); }
        }

        .brow-shadow {
          animation: shadowAppear 0.5s ease-out 2.2s forwards;
        }

        @keyframes shadowAppear {
          to { opacity: 0.025; }
        }

        @media (prefers-reduced-motion: reduce) {
          .brow-hair, .brow-shadow, .branch-stroke,
          .peony-bloom, .plum-bloom {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
          .brow-shadow { opacity: 0.025 !important; }
        }
      `}} />
    </div>
  );
}
