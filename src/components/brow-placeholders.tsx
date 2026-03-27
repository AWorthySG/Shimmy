"use client";

/**
 * SVG placeholder illustrations for each service type.
 * Each depicts the visual character of the technique.
 *
 * TODO: Replace these with actual photos of your work.
 * Recommended size: 800×400px, warm-toned, close-up brow shots.
 */

const baseClass =
  "w-full rounded-sm overflow-hidden aspect-[2/1] flex items-center justify-center";

/* ─── Eyebrow Embroidery: fine individual blade strokes ─── */
export function EmbroideryPlaceholder() {
  return (
    <div className={`${baseClass} bg-gradient-to-br from-[#F5EDE4] to-[#E8DDD0]`}>
      <svg viewBox="0 0 400 200" className="w-3/4 h-auto opacity-60">
        <defs>
          <linearGradient id="emb-g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8956A" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8B6F47" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B8956A" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Brow outline */}
        <path
          d="M80 110 Q120 60 200 55 Q280 50 340 75"
          fill="none"
          stroke="url(#emb-g)"
          strokeWidth="2"
          opacity="0.4"
        />
        {/* Individual hair strokes */}
        {[
          "M110 105 Q115 85 120 78",
          "M125 98 Q130 78 135 70",
          "M140 93 Q145 73 150 65",
          "M155 88 Q160 70 165 62",
          "M170 85 Q175 67 180 60",
          "M185 83 Q190 65 195 58",
          "M200 82 Q205 64 210 57",
          "M215 82 Q220 65 225 58",
          "M230 83 Q235 67 240 60",
          "M245 85 Q252 69 258 63",
          "M260 88 Q268 73 274 67",
          "M275 91 Q283 77 290 72",
          "M295 96 Q302 83 308 78",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#8B6F47"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.35 + (i % 3) * 0.15}
          />
        ))}
        <text x="200" y="155" textAnchor="middle" className="fill-[#A68B64]" fontSize="11" fontFamily="serif" letterSpacing="0.15em" opacity="0.6">
          FINE BLADE STROKES
        </text>
      </svg>
    </div>
  );
}

/* ─── Microblading: hand-drawn hair-like strokes ─── */
export function MicrobladingPlaceholder() {
  return (
    <div className={`${baseClass} bg-gradient-to-br from-[#F2E8DE] to-[#E5D8CA]`}>
      <svg viewBox="0 0 400 200" className="w-3/4 h-auto opacity-60">
        <defs>
          <linearGradient id="mb-g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9E7E5A" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#7A5E3E" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9E7E5A" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Brow shape guide */}
        <path
          d="M75 108 Q125 58 200 53 Q275 48 345 73"
          fill="none"
          stroke="url(#mb-g)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.35"
        />
        {/* Feathered strokes — slightly curved, varied angles */}
        {[
          "M105 103 C108 90 112 82 116 76",
          "M118 98 C122 86 126 78 129 72",
          "M132 93 C136 81 140 73 143 67",
          "M148 89 C152 77 156 70 159 64",
          "M163 86 C167 75 171 68 174 62",
          "M178 84 C182 73 186 66 189 60",
          "M193 83 C197 72 201 65 204 59",
          "M210 82 C214 72 218 65 221 59",
          "M226 83 C230 73 234 67 237 61",
          "M242 85 C247 75 251 69 255 64",
          "M258 87 C263 78 267 72 271 67",
          "M275 90 C280 81 285 76 289 71",
          "M295 94 C300 86 305 81 309 77",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#7A5E3E"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={0.3 + (i % 4) * 0.12}
          />
        ))}
        <text x="200" y="155" textAnchor="middle" className="fill-[#9E7E5A]" fontSize="11" fontFamily="serif" letterSpacing="0.15em" opacity="0.6">
          HAND-DRAWN STROKES
        </text>
      </svg>
    </div>
  );
}

/* ─── Nano Brows: tiny precise digital dots/pixels ─── */
export function NanoPlaceholder() {
  return (
    <div className={`${baseClass} bg-gradient-to-br from-[#F0E6DB] to-[#E2D5C6]`}>
      <svg viewBox="0 0 400 200" className="w-3/4 h-auto opacity-60">
        {/* Brow outline */}
        <path
          d="M80 108 Q130 58 200 53 Q270 48 340 73"
          fill="none"
          stroke="#8B7355"
          strokeWidth="1"
          opacity="0.25"
        />
        {/* Tiny precision dots arranged in brow shape */}
        {(() => {
          const dots: { cx: number; cy: number; r: number; o: number }[] = [];
          for (let i = 0; i < 120; i++) {
            const t = i / 120;
            const x = 95 + t * 240;
            const browY =
              110 - 45 * Math.sin(t * Math.PI) * (1 - 0.3 * t);
            const spread = 8 + 10 * Math.sin(t * Math.PI);
            const offsetY = (Math.random() - 0.5) * spread;
            const offsetX = (Math.random() - 0.5) * 4;
            dots.push({
              cx: x + offsetX,
              cy: browY + offsetY,
              r: 0.8 + Math.random() * 0.6,
              o: 0.2 + Math.random() * 0.4,
            });
          }
          return dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#7A6348" opacity={d.o} />
          ));
        })()}
        <text x="200" y="155" textAnchor="middle" className="fill-[#8B7355]" fontSize="11" fontFamily="serif" letterSpacing="0.15em" opacity="0.6">
          DIGITAL NANO PRECISION
        </text>
      </svg>
    </div>
  );
}

/* ─── Ombre Powder: gradient shading, light to dense ─── */
export function OmbrePlaceholder() {
  return (
    <div className={`${baseClass} bg-gradient-to-br from-[#F3EAE0] to-[#E6DACB]`}>
      <svg viewBox="0 0 400 200" className="w-3/4 h-auto opacity-60">
        <defs>
          <linearGradient id="ombre-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9E8567" stopOpacity="0.08" />
            <stop offset="35%" stopColor="#8B7050" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#7A5E3E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6B4F30" stopOpacity="0.55" />
          </linearGradient>
          <clipPath id="ombre-clip">
            <path d="M80 110 Q100 85 130 72 Q170 58 210 55 Q260 52 300 60 Q330 68 345 78 L340 90 Q300 80 260 74 Q220 70 180 72 Q140 78 110 90 Q90 100 80 110 Z" />
          </clipPath>
        </defs>
        {/* Filled gradient brow shape */}
        <rect x="70" y="45" width="290" height="75" fill="url(#ombre-fill)" clipPath="url(#ombre-clip)" />
        {/* Brow outline */}
        <path
          d="M80 110 Q100 85 130 72 Q170 58 210 55 Q260 52 300 60 Q330 68 345 78"
          fill="none"
          stroke="#8B7050"
          strokeWidth="1"
          opacity="0.3"
        />
        <path
          d="M80 110 Q90 100 110 90 Q140 78 180 72 Q220 70 260 74 Q300 80 340 90"
          fill="none"
          stroke="#8B7050"
          strokeWidth="1"
          opacity="0.2"
        />
        <text x="200" y="155" textAnchor="middle" className="fill-[#8B7050]" fontSize="11" fontFamily="serif" letterSpacing="0.15em" opacity="0.6">
          SOFT GRADIENT SHADING
        </text>
      </svg>
    </div>
  );
}

/* ─── Brow Shaping: clean arch lines with measuring guides ─── */
export function ShapingPlaceholder() {
  return (
    <div className={`${baseClass} bg-gradient-to-br from-[#F5EDE4] to-[#E8DDD0]`}>
      <svg viewBox="0 0 400 200" className="w-3/4 h-auto opacity-60">
        {/* Measuring guide lines */}
        <line x1="200" y1="30" x2="200" y2="130" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        <line x1="140" y1="40" x2="280" y2="120" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        <line x1="160" y1="35" x2="310" y2="100" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        {/* Brow arch — clean and precise */}
        <path
          d="M85 105 Q130 60 200 55 Q270 50 340 72"
          fill="none"
          stroke="#8B6F47"
          strokeWidth="2"
          opacity="0.5"
        />
        {/* Lower brow line */}
        <path
          d="M90 108 Q135 80 200 75 Q270 72 335 82"
          fill="none"
          stroke="#8B6F47"
          strokeWidth="1.5"
          opacity="0.35"
        />
        {/* Arch peak marker */}
        <circle cx="235" cy="53" r="3" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.5" />
        <circle cx="90" cy="106" r="2.5" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
        <circle cx="338" cy="77" r="2.5" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
        <text x="200" y="155" textAnchor="middle" className="fill-[#A68B64]" fontSize="11" fontFamily="serif" letterSpacing="0.15em" opacity="0.6">
          SCULPT &amp; DESIGN
        </text>
      </svg>
    </div>
  );
}

/* ─── Lip Blush: soft lip shape with gentle colour wash ─── */
export function LipBlushPlaceholder() {
  return (
    <div className={`${baseClass} bg-gradient-to-br from-[#F5EAE6] to-[#EADAD4]`}>
      <svg viewBox="0 0 400 200" className="w-3/4 h-auto opacity-60">
        <defs>
          <radialGradient id="lip-glow" cx="50%" cy="45%" r="40%">
            <stop offset="0%" stopColor="#C4797A" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#C4797A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C4797A" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Soft colour glow */}
        <ellipse cx="200" cy="85" rx="90" ry="40" fill="url(#lip-glow)" />
        {/* Upper lip — cupid's bow */}
        <path
          d="M130 88 Q155 72 175 78 Q188 82 200 72 Q212 82 225 78 Q245 72 270 88"
          fill="none"
          stroke="#B06B6C"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.45"
        />
        {/* Lower lip */}
        <path
          d="M130 88 Q155 92 200 108 Q245 92 270 88"
          fill="none"
          stroke="#B06B6C"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Inner colour hint */}
        <path
          d="M145 88 Q170 82 200 78 Q230 82 255 88 Q230 98 200 102 Q170 98 145 88"
          fill="#C4797A"
          opacity="0.1"
        />
        <text x="200" y="155" textAnchor="middle" className="fill-[#B08080]" fontSize="11" fontFamily="serif" letterSpacing="0.15em" opacity="0.6">
          SOFT COLOUR TINT
        </text>
      </svg>
    </div>
  );
}
