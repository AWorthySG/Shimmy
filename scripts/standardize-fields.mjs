// One-off codemod: move light-background text inputs and textareas onto the
// design-system `.field` class. Layout utilities (width, margin, icon offset)
// are kept. Usage: node scripts/standardize-fields.mjs
import fs from "node:fs";
import path from "node:path";

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx") && !p.includes("BrowSelfieCamera")) files.push(p);
  }
})("src");

const VISUAL = [
  /^border$/, /^border-vermillion\/\d+$/, /^bg-(soft-white|cream\/50)$/, /^p[xy]-[\d.]+$/, /^p[lr]-4$/,
  /^text-(sm|xs|charcoal)$/, /^placeholder:/, /^focus:/, /^transition-colors$/, /^outline-none$/,
];

let count = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  let out = "";
  let last = 0;
  for (const m of src.matchAll(/<(input|textarea)\b/g)) {
    const start = m.index;
    const chunk = src.slice(start, start + 900);
    const c = chunk.match(/className="([^"]+)"/);
    if (!c) continue;
    const t = c[1].trim().split(/\s+/);
    const light = t.some((x) => /^bg-(soft-white|cream\/50)$/.test(x)) && t.some((x) => /^border-vermillion\//.test(x));
    if (!light || t.includes("field")) continue;
    const kept = t.filter((x) => !VISUAL.some((re) => re.test(x)));
    const next = ["field", ...kept].join(" ");
    const abs = start + c.index;
    out += src.slice(last, abs) + `className="${next}"`;
    last = abs + c[0].length;
    count++;
  }
  if (last) fs.writeFileSync(f, out + src.slice(last));
}
console.log("fields standardised:", count);
