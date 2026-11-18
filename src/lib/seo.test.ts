import { test } from "node:test";
import assert from "node:assert/strict";
import { clampDescription, pageMeta } from "./seo.ts";

test("short descriptions are left alone", () => {
  assert.equal(clampDescription("Nano brows in Singapore."), "Nano brows in Singapore.");
});

test("long descriptions are cut on a word boundary within 160 characters", () => {
  const long = "Handcrafted press-on nails ".repeat(10);
  const out = clampDescription(long);
  assert.ok(out.length <= 160, String(out.length));
  assert.ok(out.endsWith("…"));
  assert.doesNotMatch(out, / …$/);
});

test("pageMeta sets canonical, og:url, a share image and a large Twitter card", () => {
  const m = pageMeta({ title: "T", description: "D", path: "/blog/x", type: "article" });
  assert.deepEqual(m.alternates, { canonical: "/blog/x" });
  const og = m.openGraph as { url: string; images: { url: string }[]; type: string };
  assert.equal(og.url, "/blog/x");
  assert.equal(og.type, "article");
  assert.equal(og.images[0].url, "/opengraph-image");
  assert.equal((m.twitter as { card: string }).card, "summary_large_image");
  assert.equal(m.robots, undefined);
});

test("noindex pages say so", () => {
  const m = pageMeta({ title: "T", description: "D", path: "/wishlist", noindex: true });
  assert.deepEqual(m.robots, { index: false, follow: true });
});
