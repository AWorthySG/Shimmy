import { test } from "node:test";
import assert from "node:assert/strict";
import { en } from "./i18n-en.ts";
import { BROW_SERVICES, getBrowService, serviceKeys } from "./brow-services.ts";
import { BOOKING_SERVICES } from "./booking.ts";

test("every service page has all its text", () => {
  for (const s of BROW_SERVICES) {
    const k = serviceKeys(s);
    const keys = [k.title, k.price, k.duration, k.desc, k.longevity, ...k.includes, ...k.faqs.flatMap((f) => [f.q, f.a])];
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
