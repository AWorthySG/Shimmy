import { test } from "node:test";
import assert from "node:assert/strict";
import { en } from "./i18n-en.ts";
import { BOOKING_SERVICES } from "./booking.ts";
import { BROW_STYLES } from "./brow-styles.ts";

// The same facts appear in several places on the site. These tests keep them in step.

const priceOf = (key: string) => Number(en[key].match(/S\$(\d+)/)?.[1]);

/** Upper end of a duration string such as "2 to 2.5 hours" or "30 to 45 minutes", in minutes. */
function maxMinutes(text: string): number {
  const nums = [...text.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  const max = Math.max(...nums);
  return /hour/.test(text) ? max * 60 : max;
}

test("booking form prices match the services page", () => {
  for (const s of BOOKING_SERVICES) {
    assert.doesNotMatch(s.price, /X/, `${s.id} still has a placeholder price`);
    assert.equal(Number(s.price.match(/S\$(\d+)/)?.[1]), priceOf(`svc.${s.id}.price`), s.id);
  }
});

test("booking slots are long enough for the stated session length", () => {
  for (const s of BOOKING_SERVICES) {
    assert.ok(
      s.duration >= maxMinutes(en[`svc.${s.id}.duration`]),
      `${s.id}: slot ${s.duration} min is shorter than "${en[`svc.${s.id}.duration`]}"`,
    );
  }
});

test("try-on prices match the services page", () => {
  for (const style of BROW_STYLES) {
    const service = style.longevityKey.split(".").pop()!;
    assert.equal(style.priceFrom, priceOf(`svc.${service}.price`), style.id);
  }
});

test("try-on and comparison table give the same longevity", () => {
  for (const service of ["nano", "microblading", "ombre", "embroidery"]) {
    assert.equal(en[`tryon.longevity.${service}`], en[`compare.longevity.${service}`], service);
  }
});
