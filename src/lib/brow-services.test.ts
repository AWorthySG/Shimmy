import { test } from "node:test";
import assert from "node:assert/strict";
import { en } from "./i18n-en.ts";
import { BROW_SERVICES, getBrowService, serviceForTags, serviceKeys, tagForService } from "./brow-services.ts";
import { blogPosts } from "./blog.ts";
import { BOOKING_SERVICES } from "./booking.ts";

test("every service page has all its text", () => {
  for (const s of BROW_SERVICES) {
    const k = serviceKeys(s);
    const keys = [
      k.title, k.price, k.duration, k.desc, k.longevity, s.skinKey,
      ...k.includes,
      ...k.faqs.flatMap((f) => [f.q, f.a]),
      ...k.steps.flatMap((st) => [st.title, st.time, st.desc]),
      ...(s.aftercare ? [s.aftercare.key] : []),
    ];
    for (const key of keys) assert.ok(en[key], `${s.slug}: missing ${key}`);
  }
});

test("slugs are unique and resolve", () => {
  const slugs = BROW_SERVICES.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.equal(getBrowService(slug)?.slug, slug);
  assert.equal(getBrowService("nope"), undefined);
});

test("every service can be booked online", () => {
  for (const s of BROW_SERVICES) {
    assert.ok(BOOKING_SERVICES.some((b) => b.id === s.id), `${s.id} is not in BOOKING_SERVICES`);
  }
});

test("search snippets quote the real price and are not too long", () => {
  for (const s of BROW_SERVICES) {
    const price = en[`svc.${s.id}.price`].match(/S\$\d+/)![0];
    assert.ok(s.seoDescription.includes(price), `${s.slug} description should mention ${price}`);
    assert.ok(s.seoDescription.length <= 160, `${s.slug} description is ${s.seoDescription.length} chars`);
    assert.doesNotMatch(s.seoTitle + s.seoDescription, /[—–]/);
  }
});

test("blog posts point to the most specific service", () => {
  assert.equal(serviceForTags(["comparison", "nano-brows", "microblading"])?.slug, "nano-brows");
  assert.equal(serviceForTags(["aftercare", "embroidery"])?.slug, "eyebrow-embroidery");
  assert.equal(serviceForTags(["lip-blush", "aftercare"])?.slug, "lip-blush");
  assert.equal(serviceForTags(["press-on-nails"]), undefined);
});

test("every brows article links to a service page", () => {
  for (const post of blogPosts.filter((p) => p.category === "brows")) {
    assert.ok(serviceForTags(post.tags), `${post.slug} has no service tag`);
  }
});

test("aftercare links point to real articles, and every service has related reading", () => {
  const slugs = new Set(blogPosts.map((p) => p.slug));
  for (const s of BROW_SERVICES) {
    if (s.aftercare) assert.ok(slugs.has(s.aftercare.slug), `${s.slug}: ${s.aftercare.slug}`);
    const tag = tagForService(s);
    assert.ok(tag, `${s.slug} has no blog tag`);
    assert.ok(blogPosts.some((p) => p.tags.includes(tag!)), `${s.slug}: no article tagged ${tag}`);
  }
});
