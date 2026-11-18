import { test } from "node:test";
import assert from "node:assert/strict";
import { bookingWindow, isoDateIn } from "./booking-window.ts";

test("dates use the studio's time zone, not UTC", () => {
  // 20:00 UTC on 17 Nov is already 18 Nov in Singapore.
  assert.equal(isoDateIn(new Date("2026-11-17T20:00:00Z"), "Asia/Singapore"), "2026-11-18");
});

test("window runs from today to today + N days", () => {
  assert.deepEqual(bookingWindow(new Date("2026-11-18T02:00:00Z"), 60, "Asia/Singapore"), {
    from: "2026-11-18",
    to: "2027-01-17",
  });
});
