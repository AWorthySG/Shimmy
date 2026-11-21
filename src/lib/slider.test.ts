import { test } from "node:test";
import assert from "node:assert/strict";
import { clampPercent } from "./slider.ts";

test("clampPercent keeps values inside 0 to 100", () => {
  assert.equal(clampPercent(-5), 0);
  assert.equal(clampPercent(140), 100);
  assert.equal(clampPercent(42.6), 43);
});

test("clampPercent falls back to the middle for non-numbers", () => {
  assert.equal(clampPercent(Number.NaN), 50);
  assert.equal(clampPercent(Number.POSITIVE_INFINITY), 50);
});
