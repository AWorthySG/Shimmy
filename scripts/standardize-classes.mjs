// One-off codemod: move buttons, tags and eyebrow labels onto the design
// system classes in src/app/globals.css, and snap letter-spacing to the scale.
// Usage: node scripts/standardize-classes.mjs [--dry]
import fs from "node:fs";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx")) files.push(p);
  }
})("src");

// The selfie camera is a dark, full-screen tool with its own styling.
const SKIP_FILES = ["BrowSelfieCamera.tsx"];

const TRACKING = {
  "tracking-[0.08em]": "tracking-wide",
  "tracking-[0.1em]": "tracking-button",
  "tracking-[0.12em]": "tracking-button",
  "tracking-[0.15em]": "tracking-button",
  "tracking-[0.2em]": "tracking-label",
  "tracking-[0.25em]": "tracking-label",
  "tracking-[0.3em]": "tracking-eyebrow",
  "tracking-[0.35em]": "tracking-eyebrow",
  "tracking-[0.5em]": "tracking-eyebrow",
};

const BUTTON_VISUAL = [
  /^(sm:|md:|lg:)?(px|py)-[\d.]+$/,
  /^(sm:|md:)?text-(xs|sm|\[\d+px\])$/,
  /^uppercase$/,
  /^tracking-/,
  /^bg-(vermillion|charcoal|soft-white|cream|gold|jade)(-dark|-light)?(\/\d+)?$/,
  /^hover:opacity-\d+$/, /^font-bold$/,
  /^text-(soft-white|vermillion|vermillion-dark|charcoal|charcoal-light|white)(\/\d+)?$/,
  /^border(-(vermillion|charcoal|soft-white|gold)(-dark)?)?(\/\d+)?$/,
  /^hover:(bg|text|border)-/,
  /^transition(-[a-z]+)?$/,
  /^duration-\d+$/,
  /^rounded(-[a-z]+)?$/,
  /^(inline-flex|inline-block|items-center|justify-center|gap-2|text-center|font-medium)$/,
  /^disabled:(opacity-\d+|cursor-not-allowed)$/,
];
const TAG_VISUAL = [
  /^text-\[(9|10)px\]$/, /^uppercase$/, /^tracking-/, /^px-[23]$/, /^py-(0\.5|1|1\.5)$/,
  /^border(-[a-z-]+)?(\/\d+)?$/, /^bg-(vermillion|jade|gold)\/\d+$/, /^text-(vermillion-dark|jade|charcoal-light)$/,
];
const EYEBROW_VISUAL = [
  /^(sm:|md:)?text-(\[(10|11)px\]|xs)$/, /^uppercase$/, /^tracking-/, /^text-vermillion-dark$/,
];

const has = (t, re) => t.some((x) => re.test(x));
const strip = (t, res) => t.filter((x) => !res.some((re) => re.test(x)));

function classify(tokens) {
  const t = tokens;
  if (t.includes("btn") || t.includes("tag") || t.includes("eyebrow")) return null;
  const upper = t.includes("uppercase");
  const tracked = has(t, /^tracking-/);

  if (upper && has(t, /^text-\[(9|10)px\]$/) && has(t, /^px-[23]$/) && has(t, /^py-(0\.5|1|1\.5)$/) &&
      t.includes("border") && !has(t, /^hover:/) && has(t, /^bg-(vermillion|jade|gold)\/\d+$/)) {
    const variant = has(t, /jade/) ? " tag-jade" : has(t, /gold/) ? " tag-gold" : "";
    return { kind: "tag", out: ["tag" + variant, ...strip(t, TAG_VISUAL)] };
  }

  if (upper && tracked && has(t, /^(sm:)?px-([4-9]|1[0-2])$/) && has(t, /^py-(2|2\.5|3|3\.5|4)$/)) {
    let variant = null;
    if (has(t, /^bg-(vermillion(-dark)?|gold|jade)$/)) variant = "primary";
    else if (has(t, /^bg-charcoal$/)) variant = "dark";
    else if (has(t, /^bg-soft-white$/)) variant = "light";
    else if (t.includes("border") && has(t, /^border-charcoal/)) variant = "outline";
    else if (t.includes("border") && has(t, /^border-vermillion/)) variant = "secondary";
    if (!variant) return { kind: "unclassified-button" };
    const size = has(t, /^(sm:)?(py-(3\.5|4)|px-(8|10))$/) ? " btn-lg"
      : has(t, /^(py-(2|2\.5)|text-\[(10|11)px\])$/) ? " btn-sm" : "";
    return { kind: "button:" + variant, out: [`btn btn-${variant}${size}`, ...strip(t, BUTTON_VISUAL)] };
  }

  if (upper && has(t, /^tracking-\[(0\.3|0\.35)em\]$/) && t.includes("text-vermillion-dark") &&
      !has(t, /^(px|py)-/) && has(t, /^text-(\[(10|11)px\]|xs)$/)) {
    return { kind: "eyebrow", out: ["eyebrow", ...strip(t, EYEBROW_VISUAL)] };
  }
  return null;
}

function rewriteClassList(list, stats, where) {
  // Leave dynamic segments of template literals untouched.
  if (list.includes("${")) {
    const parts = list.split(/(\$\{[^}]*\})/);
    return parts.map((p) => (p.startsWith("${") ? p : rewriteStatic(p, stats, where, true))).join("");
  }
  return rewriteStatic(list, stats, where, false);
}

function rewriteStatic(list, stats, where, partial) {
  const lead = list.match(/^\s*/)[0], trail = list.match(/\s*$/)[0];
  let tokens = list.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return list;
  if (!partial) {
    const c = classify(tokens);
    if (c?.out) { stats[c.kind] = (stats[c.kind] || 0) + 1; tokens = c.out; }
    else if (c?.kind) { stats[c.kind] = (stats[c.kind] || 0) + 1; stats.unclassified.push(where + "  " + list.trim()); }
  }
  tokens = tokens.map((x) => {
    const m = x.match(/^((?:[a-z]+:)*)(tracking-\[[\d.]+em\])$/);
    if (m && TRACKING[m[2]]) { stats.tracking++; return m[1] + TRACKING[m[2]]; }
    return x;
  });
  return lead + tokens.join(" ") + trail;
}

const stats = { tracking: 0, unclassified: [] };
let changedFiles = 0;
for (const f of files) {
  if (SKIP_FILES.some((s) => f.endsWith(s))) continue;
  const src = fs.readFileSync(f, "utf8");
  const out = src
    .replace(/className="([^"]*)"/g, (_, c) => `className="${rewriteClassList(c, stats, f)}"`)
    .replace(/className=\{`([^`]*)`\}/g, (_, c) => "className={`" + rewriteClassList(c, stats, f) + "`}");
  if (out !== src) {
    changedFiles++;
    if (!DRY) fs.writeFileSync(f, out);
  }
}
const { unclassified, ...counts } = stats;
console.log(JSON.stringify(counts, null, 1));
console.log("files changed:", changedFiles);
if (unclassified.length) console.log("UNCLASSIFIED (left as-is):\n" + unclassified.join("\n"));
