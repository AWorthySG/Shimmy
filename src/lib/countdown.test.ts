import { test } from "node:test";
import assert from "node:assert/strict";
import { getTimeLeft, parseLaunchDate } from "./countdown.ts";

test("launch date comes only from a valid setting", () => {
  assert.equal(parseLaunchDate(undefined), null);
  assert.equal(parseLaunchDate(""), null);
  assert.equal(parseLaunchDate("not a date"), null);
  assert.equal(parseLaunchDate("2026-12-01T10:00:00+08:00")?.toISOString(), "2026-12-01T02:00:00.000Z");
});

test("time left splits into days, hours, minutes and seconds", () => {
  const target = new Date("2026-12-01T00:00:00Z");
  const now = Date.parse("2026-11-29T22:58:30Z");
  assert.deepEqual(getTimeLeft(target, now), { days: 1, hours: 1, minutes: 1, seconds: 30 });
});

test("a past launch date shows zero, never negative", () => {
  const target = new Date("2026-01-01T00:00:00Z");
  assert.deepEqual(getTimeLeft(target, Date.parse("2026-11-19T00:00:00Z")), { days: 0, hours: 0, minutes: 0, seconds: 0 });
});
