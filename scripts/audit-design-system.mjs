#!/usr/bin/env node
// Reports markup that breaks docs/DESIGN_SYSTEM.md. Exit code 1 when anything is found.
// Usage: node scripts/audit-design-system.mjs [--quiet]
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIRS = ["src/app", "src/components"];

// Documented colour exceptions (docs/DESIGN_SYSTEM.md, section 1):
// the OG image is rendered outside the CSS, the try-on and size guide draw real pigment and
// nail colours, brow-placeholders are skin-tone illustrations, and the selfie camera is a
// full-screen black camera view whose text colours match the guide lines it draws.
const COLOUR_EXEMPT = [
  "src/app/opengraph-image.tsx",
  "src/components/BrowTryOn.tsx",
  "src/components/BrowSelfieCamera.tsx",
  "src/components/SizeGuide.tsx",
  "src/components/brow-placeholders.tsx",
];

const PALETTE =
  "red|green|blue|yellow|gray|grey|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose";

const RULES = [
  {
    id: "default-palette",
    why: "Tailwind default palette colour; use a design token",
    re: new RegExp(`\\b(?:text|bg|border|ring|from|via|to|fill|stroke|outline|decoration|divide|placeholder)-(?:${PALETTE})-\\d{2,3}\\b`, "g"),
    colour: true,
  },
  {
    id: "raw-hex",
    why: "raw hex colour in markup; use a design token",
    re: /(?:className=|style=\{\{)[^>\n]*#[0-9a-fA-F]{3,8}\b/g,
    colour: true,
  },
  {
    id: "retired-effect",
    why: "decorative effect retired for a calmer look (see DESIGN_SYSTEM.md)",
    re: /(?<![\w-])(?:glow-pulse|btn-magnetic|shine-on-hover|shine-sweep|shimmer-text|animate-shimmer|sparkle|star-spin)(?![\w-])/g,
  },
  { id: "arbitrary-tracking", why: "arbitrary letter-spacing; use tracking-button/label/eyebrow", re: /\btracking-\[[^\]]+\]/g },
  { id: "off-scale-tracking", why: "letter-spacing outside the scale", re: /(?<!normal-case )\btracking-(?:widest|tighter|tight|normal)\b/g },
  { id: "rounded-corners", why: "rounded corner on a square component; only rounded-full is allowed", re: /\brounded(?:-(?:sm|md|lg|xl|2xl|3xl))?(?=["'\s`])/g },
  {
    id: "handmade-button",
    why: "button styled by hand; use btn + variant",
    re: /<(?:button|a|Link)\b(?=(?:=>|[^>])*className="(?![^"]*\b(?:btn|chip|tag)\b)[^"]*\buppercase\b[^"]*\bpx-\d)(?=(?:=>|[^>])*className="[^"]*\bpy-\d)(?:=>|[^>])*>/g,
  },
  {
    id: "small-display-font",
    why: "Italiana is for headings of text-2xl and up; use Lora (font-sans font-medium) for smaller headings",
    re: /className=(?:"|\{`)(?=[^"`]*(?<![\w-])font-serif(?![\w-]))(?![^"`]*(?<![\w-])(?:\w+:)?text-[2-9]xl(?=[\s"`]))[^"`]*/g,
    // Brand marks (the Shimmy wordmark and seal) and the intro animations.
    exempt: ["src/components/navbar.tsx", "src/components/footer.tsx", "src/components/brow-intro.tsx", "src/components/nail-intro.tsx"],
  },
  {
    id: "text-glyph-icon",
    why: "text character used as an icon; use a component from src/components/icons.tsx",
    re: /[✦✧◆❖✿★☆✓✕⤓]|(?:[>}]\s*[←→↑])|(?:[←→↑]\s*[<{])/g,
    exempt: ["src/components/brow-intro.tsx", "src/components/nail-intro.tsx"],
  },
  {
    id: "unstyled-field",
    why: "text input or textarea without the field class",
    re: /<(?:input|textarea)\b(?!(?:=>|[^>])*type="(?:checkbox|radio|range|file|hidden|color|submit)")(?!(?:=>|[^>])*className=(?:"[^"]*|\{`[^`]*)\b(?:field|bg-charcoal[\w/-]*|bg-transparent|bg-white\/\d+)(?=[\s"`]))(?:=>|[^>])*>/g,
  },
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const quiet = process.argv.includes("--quiet");
const counts = {};
let total = 0;
for (const dir of DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    const rel = path.relative(ROOT, file);
    const src = fs.readFileSync(file, "utf8");
    for (const rule of RULES) {
      if (rule.colour && COLOUR_EXEMPT.includes(rel)) continue;
      if (rule.exempt?.includes(rel)) continue;
      for (const m of src.matchAll(rule.re)) {
        const line = src.slice(0, m.index).split("\n").length;
        counts[rule.id] = (counts[rule.id] ?? 0) + 1;
        total++;
        if (!quiet) console.log(`${rel}:${line}  [${rule.id}] ${m[0].slice(0, 110).replace(/\s+/g, " ")}`);
      }
    }
  }
}
console.log(`\n${total} issues`, counts);
process.exit(total ? 1 : 0);
