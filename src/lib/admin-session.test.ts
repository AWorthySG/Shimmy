import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SESSION_TTL_MS,
  checkPassword,
  createSessionToken,
  verifySessionToken,
} from "./admin-session.ts";

const SECRET = "correct horse battery staple";

test("password check accepts only the exact secret", () => {
  assert.equal(checkPassword(SECRET, SECRET), true);
  assert.equal(checkPassword("wrong", SECRET), false);
  assert.equal(checkPassword(SECRET + " ", SECRET), false);
});

test("password check fails closed when no secret is configured", () => {
  assert.equal(checkPassword("", ""), false);
  assert.equal(checkPassword("anything", undefined), false);
  assert.equal(checkPassword(undefined, SECRET), false);
  assert.equal(checkPassword(123, SECRET), false);
});

test("a fresh session token verifies", () => {
  const now = 1_700_000_000_000;
  const token = createSessionToken(SECRET, now);
  assert.equal(verifySessionToken(token, SECRET, now + 1000), true);
});

test("session token expires after the TTL", () => {
  const now = 1_700_000_000_000;
  const token = createSessionToken(SECRET, now);
  assert.equal(verifySessionToken(token, SECRET, now + SESSION_TTL_MS), false);
});

test("session token is rejected under a different secret", () => {
  const token = createSessionToken(SECRET);
  assert.equal(verifySessionToken(token, "rotated-secret"), false);
  assert.equal(verifySessionToken(token, undefined), false);
});

test("tampered or malformed tokens are rejected", () => {
  const now = 1_700_000_000_000;
  const token = createSessionToken(SECRET, now);
  const [expiry, mac] = token.split(".");
  const later = String(Number(expiry) + SESSION_TTL_MS);
  assert.equal(verifySessionToken(`${later}.${mac}`, SECRET, now), false);
  assert.equal(verifySessionToken(`${expiry}.${"0".repeat(mac.length)}`, SECRET, now), false);
  assert.equal(verifySessionToken("garbage", SECRET, now), false);
  assert.equal(verifySessionToken("", SECRET, now), false);
  assert.equal(verifySessionToken(undefined, SECRET, now), false);
});
