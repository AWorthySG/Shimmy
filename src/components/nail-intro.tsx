"use client";

import { useState, useEffect } from "react";

/**
 * Full-screen intro — Elaborate nail painting & application animation.
 *
 * Phases (4 seconds total):
 *   1. HAND       (0–0.6s)   — Elegant hand silhouette draws in
 *   2. BARE NAIL  (0.3–0.8s) — Almond-shaped bare nail appears on ring finger
 *   3. BASE COAT  (0.6–1.2s) — Translucent base coat shimmers on
 *   4. PAINTING   (0.8–2.0s) — Rich dusty rose polish paints down in 3 brush strokes
 *   5. GLOSS      (1.8–2.2s) — Glossy shine sweeps across
 *   6. NAIL ART   (2.0–2.6s) — Gold foil, gems, flower petals bloom on nail
 *   7. LIFT OFF   (2.3–2.8s) — Painted nail lifts with a gentle glow
 *   8. APPLY      (2.6–3.2s) — Nail floats down and settles onto fingertip
 *   9. SPARKLE    (3.0–3.4s) — Burst of sparkles around completed nail
 *  10. BRANDING   (3.0–3.5s) — "Shimmyhands" fades in elegantly
 *  11. FADE       (3.5–4.0s) — Scene dissolves
 */
export function NailIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"painting" | "applying" | "branding" | "fading">("painting");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("applying"), 2300);
    const t2 = setTimeout(() => setPhase("branding"), 3000);
    const t3 = setTimeout(() => setPhase("fading"), 3500);
    const t4 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  const isBranding = phase === "branding" || phase === "fading";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "radial-gradient(ellipse at 50% 40%, #FFFBF8 0%, #FAF0EB 35%, #F0E2DA 70%, #E8D5CC 100%)" }}
    >
      {/* ── Background floating petals ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => {
          const size = 8 + (i % 4) * 5;
          const x = 3 + ((i * 5.3 + 7) % 90);
          const y = 2 + ((i * 7.1 + 3) % 88);
          const rot = i * 20;
          const delay = i * 0.35;
          const op = 0.06 + (i % 3) * 0.04;
          return (
            <svg
              key={i}
              className="absolute"
              width={size}
              height={size}
              viewBox="0 0 20 20"
              style={{
                left: `${x}%`, top: `${y}%`,
                opacity: op,
                transform: `rotate(${rot}deg)`,
                animation: `driftPetal ${6 + (i % 3) * 2}s ease-in-out ${delay}s infinite`,
              }}
            >
              <path d="M10 2 C14 4, 18 8, 16 13 C14 17, 10 18, 10 18 C10 18, 6 17, 4 13 C2 8, 6 4, 10 2Z" fill="#D4A0A0" />
            </svg>
          );
        })}
      </div>

      {/* ── Decorative rings ── */}
      <div className="absolute pointer-events-none" style={{
        width: 420, height: 420, left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 0,
        animation: "fadeIn 1s ease-out 0.5s forwards",
      }}>
        <svg viewBox="0 0 420 420" width="420" height="420">
          <circle cx="210" cy="210" r="195" fill="none" stroke="#D4A0A0" strokeWidth="0.3" opacity="0.2"
            style={{ strokeDasharray: 1230, strokeDashoffset: 1230, animation: "drawRing 2s ease-out 0.5s forwards" }} />
          <circle cx="210" cy="210" r="205" fill="none" stroke="#C4A882" strokeWidth="0.2" opacity="0.12"
            style={{ strokeDasharray: 1290, strokeDashoffset: 1290, animation: "drawRing 2.5s ease-out 0.8s forwards" }} />
        </svg>
      </div>

      {/* ══════════════ MAIN SVG ══════════════ */}
      <svg
        viewBox="0 0 500 550"
        className="relative z-10 w-[80vw] h-[80vh] max-w-[460px] max-h-[520px]"
        style={{ filter: "drop-shadow(0 8px 30px rgba(180, 120, 120, 0.1))" }}
      >
        <defs>
          {/* Polish gradient — rich dusty rose with depth */}
          <linearGradient id="ni-polish" x1="0%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#DBA8A8" />
            <stop offset="30%" stopColor="#D49898" />
            <stop offset="60%" stopColor="#C88888" />
            <stop offset="100%" stopColor="#B87878" />
          </linearGradient>

          {/* Second coat — slightly different for depth */}
          <linearGradient id="ni-polish2" x1="10%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8A0A0" />
            <stop offset="100%" stopColor="#C08080" />
          </linearGradient>

          {/* Gloss highlight */}
          <linearGradient id="ni-gloss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Skin tone gradients */}
          <linearGradient id="ni-skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5DDD2" />
            <stop offset="100%" stopColor="#EDCFC2" />
          </linearGradient>
          <linearGradient id="ni-skinDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAC8BA" />
            <stop offset="100%" stopColor="#E0B8A8" />
          </linearGradient>

          {/* Nail clip path — elegant almond shape */}
          <clipPath id="ni-nailClip">
            <path d="M 210 115 C 210 88, 222 62, 250 55 C 278 62, 290 88, 290 115 L 290 215 Q 290 228, 280 232 L 220 232 Q 210 228, 210 215 Z" />
          </clipPath>

          {/* Sparkle radial */}
          <radialGradient id="ni-spark">
            <stop offset="0%" stopColor="#C4A882" stopOpacity="1" />
            <stop offset="50%" stopColor="#C4A882" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C4A882" stopOpacity="0" />
          </radialGradient>

          {/* Glow for nail application */}
          <radialGradient id="ni-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A0A0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4A0A0" stopOpacity="0" />
          </radialGradient>

          {/* Gold foil texture */}
          <linearGradient id="ni-goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D8C4A8" />
            <stop offset="30%" stopColor="#C4A882" />
            <stop offset="60%" stopColor="#D8C4A8" />
            <stop offset="100%" stopColor="#A68E6E" />
          </linearGradient>
        </defs>

        {/* ═══ PHASE 1: ELEGANT HAND SILHOUETTE ═══ */}

        {/* The hand (ring finger prominent) */}
        <g style={{ opacity: 0, animation: "fadeIn 0.8s ease-out 0s forwards" }}>
          {/* Palm suggestion — very subtle */}
          <path
            d="M 200 400 C 195 380, 190 350, 195 320 C 198 300, 205 280, 210 265
               L 290 265 C 295 280, 302 300, 305 320 C 310 350, 305 380, 300 400 Z"
            fill="url(#ni-skin)" opacity="0.6"
          />

          {/* Ring finger (main — the one getting the nail) */}
          <path
            d="M 215 265 C 215 255, 216 245, 218 238 C 222 225, 230 218, 250 215
               C 270 218, 278 225, 282 238 C 284 245, 285 255, 285 265"
            fill="url(#ni-skin)"
          />

          {/* Subtle finger shading */}
          <path d="M 222 260 C 222 250, 224 240, 228 232" fill="none" stroke="url(#ni-skinDark)" strokeWidth="0.8" opacity="0.3" />
          <path d="M 278 260 C 278 250, 276 242, 273 234" fill="none" stroke="url(#ni-skinDark)" strokeWidth="0.5" opacity="0.2" />

          {/* Knuckle crease */}
          <path d="M 222 262 C 235 266, 265 266, 278 262" fill="none" stroke="#DFC0B0" strokeWidth="0.6" opacity="0.25" />
        </g>

        {/* ═══ PHASE 2: BARE NAIL ═══ */}

        {/* Bare nail body (skin-toned) */}
        <path
          d="M 210 115 C 210 88, 222 62, 250 55 C 278 62, 290 88, 290 115 L 290 215 Q 290 228, 280 232 L 220 232 Q 210 228, 210 215 Z"
          fill="#F5E2DA"
          style={{ opacity: 0, animation: "fadeIn 0.5s ease-out 0.3s forwards" }}
        />

        {/* Nail outline — draws in */}
        <path
          d="M 210 115 C 210 88, 222 62, 250 55 C 278 62, 290 88, 290 115 L 290 215 Q 290 228, 280 232 L 220 232 Q 210 228, 210 215 Z"
          fill="none"
          stroke="#C8A098"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 550, strokeDashoffset: 550, animation: "drawLine 0.8s ease-out 0.2s forwards" }}
        />

        {/* Lunula (moon at base) */}
        <path
          d="M 216 218 C 225 208, 240 204, 250 203 C 260 204, 275 208, 284 218"
          fill="none" stroke="#F0D8D0" strokeWidth="0.8" opacity="0"
          style={{ animation: "fadeIn 0.4s ease-out 0.6s forwards" }}
        />
        <ellipse cx="250" cy="218" rx="28" ry="12" fill="#FFF0EC" opacity="0"
          style={{ animation: "fadeIn 0.3s ease-out 0.6s forwards" }}
        />

        {/* Cuticle line */}
        <path
          d="M 214 222 C 228 230, 245 234, 250 234 C 255 234, 272 230, 286 222"
          fill="none" stroke="#D4B8B0" strokeWidth="0.8" strokeLinecap="round"
          style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: "drawLine 0.5s ease-out 0.5s forwards" }}
        />

        {/* ═══ PHASE 3: BASE COAT (translucent shimmer) ═══ */}

        <g clipPath="url(#ni-nailClip)">
          <rect x="205" y="50" width="90" height="190" fill="rgba(255,240,236,0.5)"
            style={{ transform: "translateY(-200px)", animation: "slideDown 0.6s ease-out 0.6s forwards" }}
          />
        </g>

        {/* ═══ PHASE 4: THREE BRUSH STROKES of polish ═══ */}

        {/* Stroke 1 — center */}
        <g clipPath="url(#ni-nailClip)">
          <rect x="238" y="50" width="24" height="190" fill="url(#ni-polish)" rx="4"
            style={{ transform: "translateY(-200px)", animation: "slideDown 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards" }}
          />
        </g>

        {/* Stroke 2 — left */}
        <g clipPath="url(#ni-nailClip)">
          <rect x="212" y="50" width="30" height="190" fill="url(#ni-polish)" rx="4"
            style={{ transform: "translateY(-200px)", animation: "slideDown 0.7s cubic-bezier(0.4, 0, 0.2, 1) 1.0s forwards" }}
          />
        </g>

        {/* Stroke 3 — right */}
        <g clipPath="url(#ni-nailClip)">
          <rect x="258" y="50" width="30" height="190" fill="url(#ni-polish)" rx="4"
            style={{ transform: "translateY(-200px)", animation: "slideDown 0.7s cubic-bezier(0.4, 0, 0.2, 1) 1.2s forwards" }}
          />
        </g>

        {/* Second coat — full coverage */}
        <g clipPath="url(#ni-nailClip)">
          <rect x="205" y="50" width="90" height="190" fill="url(#ni-polish2)" opacity="0.7"
            style={{ transform: "translateY(-200px)", animation: "slideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.4s forwards" }}
          />
        </g>

        {/* Polish brush — moves with the strokes */}
        <g style={{ opacity: 0, animation: "brushPaint 2.0s ease-in-out 0.7s forwards" }}>
          {/* Bottle neck */}
          <rect x="245" y="-30" width="10" height="20" rx="2" fill="#8E5E6E" />
          {/* Cap */}
          <rect x="242" y="-38" width="16" height="14" rx="3" fill="#6E4450" />
          {/* Handle rod */}
          <rect x="247" y="-10" width="6" height="50" rx="1.5" fill="#7E4E5E" />
          {/* Bristle fan */}
          <path d="M 245 40 C 244 44, 243 50, 244 54 L 250 56 L 256 54 C 257 50, 256 44, 255 40 Z" fill="#C48888" />
          {/* Polish on bristle */}
          <ellipse cx="250" cy="55" rx="5" ry="2.5" fill="#B87878" opacity="0.8" />
        </g>

        {/* ═══ PHASE 5: GLOSS SHINE SWEEP ═══ */}

        <g clipPath="url(#ni-nailClip)">
          {/* Main highlight */}
          <ellipse cx="232" cy="120" rx="14" ry="55" fill="url(#ni-gloss)" opacity="0"
            style={{ animation: "fadeIn 0.5s ease-out 1.8s forwards" }}
          />
          {/* Edge reflection */}
          <path d="M 215 80 Q 220 130, 218 200" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" opacity="0"
            style={{ animation: "fadeIn 0.5s ease-out 1.9s forwards" }}
          />
          {/* Shine sweep */}
          <rect x="200" y="50" width="30" height="200" fill="rgba(255,255,255,0.25)" opacity="0"
            style={{
              animation: "shineSweepNail 0.6s ease-out 2.0s forwards",
              transformOrigin: "center",
            }}
          />
        </g>

        {/* ═══ PHASE 6: NAIL ART DETAILS ═══ */}

        <g clipPath="url(#ni-nailClip)">
          {/* Gold foil fragments */}
          <polygon points="260,78 268,72 272,80 264,84" fill="url(#ni-goldFoil)" opacity="0"
            style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 2.0s forwards" }} />
          <polygon points="255,88 260,82 265,88 258,92" fill="url(#ni-goldFoil)" opacity="0"
            style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 2.1s forwards" }} />
          <polygon points="268,92 274,88 276,95 270,97" fill="url(#ni-goldFoil)" opacity="0"
            style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 2.15s forwards" }} />

          {/* Fine gold lines — art deco style */}
          <line x1="222" y1="105" x2="278" y2="95" stroke="#C4A882" strokeWidth="0.6" strokeLinecap="round"
            style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: "drawLine 0.4s ease-out 2.0s forwards" }} />
          <line x1="220" y1="112" x2="280" y2="102" stroke="#C4A882" strokeWidth="0.4" strokeLinecap="round"
            style={{ strokeDasharray: 65, strokeDashoffset: 65, animation: "drawLine 0.4s ease-out 2.1s forwards" }} />

          {/* Delicate flower — 5 petals */}
          <g style={{ opacity: 0, animation: "bloomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 2.15s forwards" }}>
            <ellipse cx="262" cy="148" rx="5" ry="9" fill="#E8C0C0" opacity="0.6" transform="rotate(0 262 148)" />
            <ellipse cx="268" cy="142" rx="5" ry="8" fill="#ECCACA" opacity="0.5" transform="rotate(72 268 142)" />
            <ellipse cx="272" cy="150" rx="4.5" ry="8" fill="#E8C0C0" opacity="0.55" transform="rotate(144 272 150)" />
            <ellipse cx="267" cy="157" rx="5" ry="8" fill="#ECCACA" opacity="0.5" transform="rotate(216 267 157)" />
            <ellipse cx="258" cy="153" rx="4.5" ry="8" fill="#E8C0C0" opacity="0.55" transform="rotate(288 258 153)" />
            {/* Center */}
            <circle cx="265" cy="150" r="3" fill="#C4A882" opacity="0.7" />
            <circle cx="265" cy="150" r="1.5" fill="#D8C4A8" opacity="0.9" />
          </g>

          {/* Second smaller flower */}
          <g style={{ opacity: 0, animation: "bloomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 2.25s forwards" }}>
            <ellipse cx="232" cy="165" rx="3.5" ry="6" fill="#E8C0C0" opacity="0.5" transform="rotate(-15 232 165)" />
            <ellipse cx="237" cy="161" rx="3" ry="5.5" fill="#ECCACA" opacity="0.4" transform="rotate(60 237 161)" />
            <ellipse cx="239" cy="168" rx="3" ry="5.5" fill="#E8C0C0" opacity="0.45" transform="rotate(130 239 168)" />
            <ellipse cx="233" cy="172" rx="3.5" ry="5.5" fill="#ECCACA" opacity="0.4" transform="rotate(200 233 172)" />
            <circle cx="235" cy="167" r="2" fill="#C4A882" opacity="0.6" />
          </g>

          {/* Gem rhinestones */}
          {[
            { cx: 242, cy: 120, r: 3, d: 2.1 },
            { cx: 258, cy: 130, r: 2.5, d: 2.2 },
            { cx: 248, cy: 180, r: 2, d: 2.3 },
            { cx: 270, cy: 170, r: 1.8, d: 2.35 },
            { cx: 230, cy: 140, r: 1.5, d: 2.4 },
          ].map((g, i) => (
            <g key={i} style={{ opacity: 0, animation: `popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${g.d}s forwards` }}>
              <circle cx={g.cx} cy={g.cy} r={g.r} fill="#C4A882" />
              <circle cx={g.cx - g.r * 0.3} cy={g.cy - g.r * 0.3} r={g.r * 0.35} fill="rgba(255,255,255,0.6)" />
            </g>
          ))}

          {/* Tiny leaf accents */}
          <path d="M 240 155 Q 235 148, 228 145" fill="none" stroke="#A8B5A0" strokeWidth="0.6" opacity="0"
            style={{ strokeDasharray: 20, strokeDashoffset: 20, animation: "drawLine 0.3s ease-out 2.3s forwards" }} />
          <path d="M 270 160 Q 276 155, 280 148" fill="none" stroke="#A8B5A0" strokeWidth="0.5" opacity="0"
            style={{ strokeDasharray: 18, strokeDashoffset: 18, animation: "drawLine 0.3s ease-out 2.35s forwards" }} />
        </g>

        {/* ═══ PHASE 7-8: NAIL LIFTS + SETTLES ON FINGER ═══ */}

        {/* Glow behind nail during lift */}
        <circle cx="250" cy="160" r="50" fill="url(#ni-glow)" opacity="0"
          style={{ animation: "glowPulseNail 0.8s ease-in-out 2.3s forwards" }}
        />

        {/* The entire nail group moves down to fingertip */}
        {/* This is handled by the nailToFinger keyframe on the main nail elements above */}

        {/* Fingertip — appears elegantly */}
        <g style={{ opacity: 0, animation: "fadeIn 0.6s ease-out 2.3s forwards" }}>
          {/* Finger */}
          <path
            d="M 218 340 C 218 318, 220 298, 225 282 C 230 268, 238 258, 250 255
               C 262 258, 270 268, 275 282 C 280 298, 282 318, 282 340 L 282 420 L 218 420 Z"
            fill="url(#ni-skin)"
          />
          {/* Side shadow */}
          <path d="M 224 335 C 224 315, 226 298, 232 282" fill="none" stroke="#E0B8A8" strokeWidth="0.7" opacity="0.3" />
          {/* Knuckle */}
          <path d="M 225 360 C 235 364, 265 364, 275 360" fill="none" stroke="#DFC0B0" strokeWidth="0.5" opacity="0.2" />
          {/* Highlight on finger */}
          <path d="M 242 290 C 245 275, 248 265, 250 260" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" opacity="0.5" />
        </g>

        {/* ═══ PHASE 9: SPARKLE BURST ═══ */}

        {isBranding && (
          <g>
            {[
              { cx: 185, cy: 120, r: 4, d: 0 },
              { cx: 315, cy: 100, r: 3.5, d: 0.1 },
              { cx: 175, cy: 200, r: 3, d: 0.15 },
              { cx: 325, cy: 190, r: 2.5, d: 0.2 },
              { cx: 200, cy: 80, r: 2.5, d: 0.25 },
              { cx: 300, cy: 240, r: 3, d: 0.1 },
              { cx: 190, cy: 160, r: 2, d: 0.3 },
              { cx: 310, cy: 150, r: 2.5, d: 0.15 },
            ].map((s, i) => (
              <g key={i}>
                <circle cx={s.cx} cy={s.cy} r={s.r} fill="url(#ni-spark)"
                  style={{ animation: `sparkBurst 0.8s ease-out ${s.d}s both` }} />
                {/* 4-point star */}
                <text x={s.cx} y={s.cy + 3} textAnchor="middle" fill="#C4A882"
                  style={{ fontSize: `${s.r * 2.5}px`, opacity: 0, animation: `sparkBurst 0.6s ease-out ${s.d + 0.1}s both` }}>
                  ✦
                </text>
              </g>
            ))}
          </g>
        )}

        {/* ═══ PHASE 10: BRANDING ═══ */}

        {/* Decorative line above text */}
        <line x1="200" y1="460" x2="300" y2="460" stroke="#D4A0A0" strokeWidth="0.5" opacity="0"
          style={{ strokeDasharray: 100, strokeDashoffset: 100,
            animation: isBranding ? "drawLine 0.5s ease-out 0s forwards" : "none" }}
        />

        <text
          x="250" y="482" textAnchor="middle" className="font-serif"
          style={{
            fontSize: "24px", fill: "#3A2E2E", letterSpacing: "0.18em",
            opacity: 0, animation: isBranding ? "fadeInUp 0.6s ease-out 0.1s forwards" : "none",
          }}
        >
          Shimmyhands
        </text>
        <text
          x="250" y="500" textAnchor="middle"
          style={{
            fontSize: "7.5px", fill: "#9B8E88", letterSpacing: "0.35em",
            opacity: 0, animation: isBranding ? "fadeInUp 0.6s ease-out 0.2s forwards" : "none",
          }}
        >
          NAIL ARTISTRY
        </text>

        {/* Decorative line below text */}
        <line x1="220" y1="510" x2="280" y2="510" stroke="#C4A882" strokeWidth="0.3" opacity="0"
          style={{ strokeDasharray: 60, strokeDashoffset: 60,
            animation: isBranding ? "drawLine 0.5s ease-out 0.15s forwards" : "none" }}
        />
      </svg>

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes drawRing {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-200px); }
          to { transform: translateY(0); }
        }
        @keyframes brushPaint {
          0%   { opacity: 1; transform: translateY(-5px); }
          12%  { opacity: 1; transform: translateY(20px); }
          28%  { opacity: 1; transform: translateY(170px); }
          32%  { opacity: 1; transform: translateY(5px) translateX(-18px); }
          52%  { opacity: 1; transform: translateY(170px) translateX(-18px); }
          56%  { opacity: 1; transform: translateY(8px) translateX(14px); }
          76%  { opacity: 1; transform: translateY(170px) translateX(14px); }
          82%  { opacity: 0.7; transform: translateY(170px) translateX(50px); }
          100% { opacity: 0; transform: translateY(170px) translateX(90px) rotate(8deg); }
        }
        @keyframes shineSweepNail {
          from { opacity: 0.8; transform: translateX(-60px); }
          to { opacity: 0; transform: translateX(100px); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0); }
          60% { opacity: 0.9; transform: scale(1.3); }
          100% { opacity: 0.7; transform: scale(1); }
        }
        @keyframes bloomIn {
          0% { opacity: 0; transform: scale(0) rotate(-30deg); }
          60% { opacity: 0.8; transform: scale(1.15) rotate(5deg); }
          100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
        }
        @keyframes glowPulseNail {
          0% { opacity: 0; transform: scale(0.8); }
          40% { opacity: 0.4; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.3); }
        }
        @keyframes sparkBurst {
          0% { opacity: 0; transform: scale(0); }
          40% { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes driftPetal {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: inherit; }
          25% { transform: translateY(-10px) rotate(12deg) translateX(5px); }
          50% { transform: translateY(-4px) rotate(-8deg) translateX(-3px); }
          75% { transform: translateY(-12px) rotate(18deg) translateX(4px); }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
