import { test } from "node:test";
import assert from "node:assert/strict";
import { formatAmount, formatPrice } from "./format.ts";

test("product prices always show two decimals with S$", () => {
  assert.equal(formatPrice(49.9), "S$49.90");
  assert.equal(formatPrice(45), "S$45.00");
  assert.equal(formatPrice(53.9), "S$53.90");
});

test("promotional amounts drop .00 but keep real cents", () => {
  assert.equal(formatAmount(10), "S$10");
  assert.equal(formatAmount(12.5), "S$12.50");
});
