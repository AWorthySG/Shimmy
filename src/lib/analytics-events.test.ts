import { test } from "node:test";
import assert from "node:assert/strict";
import { toEventRow } from "./analytics-events.ts";

test("known events are accepted with their fields", () => {
  assert.deepEqual(
    toEventRow({ event: "booking_submitted", page: "/brows", metadata: { service: "nano" }, session_id: "abc" }),
    { event: "booking_submitted", page: "/brows", metadata: { service: "nano" }, session_id: "abc" },
  );
});

test("unknown or missing events are rejected", () => {
  assert.equal(toEventRow({ event: "free_money" }), null);
  assert.equal(toEventRow({}), null);
  assert.equal(toEventRow(null), null);
  assert.equal(toEventRow("page_view"), null);
});

test("long text and oversized metadata are trimmed", () => {
  const row = toEventRow({
    event: "page_view",
    page: "x".repeat(500),
    metadata: { a: 1, b: "2", c: { nested: true }, d: 4, e: 5, f: 6, g: 7 },
  });
  assert.equal(row?.page?.length, 200);
  assert.deepEqual(row?.metadata, { a: "1", b: "2", d: "4", e: "5", f: "6" });
  assert.equal(row?.session_id, null);
});
