import { test } from "node:test";
import assert from "node:assert/strict";
import { buildReviewEmail, isSafeReviewUrl, reviewRequestDate } from "./review-request.ts";

test("asks clients whose appointment was 14 days ago", () => {
  assert.equal(reviewRequestDate(new Date("2026-11-19T10:00:00Z")), "2026-11-05");
  assert.equal(reviewRequestDate(new Date("2026-03-01T10:00:00Z")), "2026-02-15");
});

test("only http(s) review links are accepted", () => {
  assert.equal(isSafeReviewUrl("https://g.page/r/abc/review"), true);
  assert.equal(isSafeReviewUrl("javascript:alert(1)"), false);
  assert.equal(isSafeReviewUrl("not a url"), false);
  assert.equal(isSafeReviewUrl(undefined), false);
});

test("client name and service are escaped in the HTML email", () => {
  const { html, text, subject } = buildReviewEmail({
    name: '<img src=x onerror="x">',
    service: "Nano Brows",
    reviewUrl: "https://g.page/r/abc/review",
  });
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img/);
  assert.match(html, /href="https:\/\/g\.page\/r\/abc\/review"/);
  assert.match(text, /Nano Brows/);
  assert.ok(subject.length > 0);
});

test("a blank name falls back to a greeting", () => {
  assert.match(buildReviewEmail({ name: "  ", service: "Lip Blush", reviewUrl: "https://x.test" }).text, /^Hi there,/);
});
