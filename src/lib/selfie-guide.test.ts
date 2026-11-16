// Run: npm test   (node --test with native TypeScript stripping)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allPass,
  computePose,
  evaluate,
  guidesInPixels,
  LM,
  redFromY,
  yellowOffsetFromX,
  yellowPositions,
  type Pt,
} from "./selfie-guide.ts";

test("yellow lines mirror each other about the centre", () => {
  // Dragging the left line to x=0.3 and the right line to x=0.7 give the same offset.
  assert.equal(yellowOffsetFromX(0.3).toFixed(6), (0.2).toFixed(6));
  assert.equal(yellowOffsetFromX(0.7).toFixed(6), (0.2).toFixed(6));
  const [l, r] = yellowPositions(0.2);
  assert.ok(Math.abs(0.5 - l - (r - 0.5)) < 1e-12);
});

test("yellow offset is clamped so lines never cross the centre or leave the frame", () => {
  assert.equal(yellowOffsetFromX(0.5), 0.02);
  assert.equal(yellowOffsetFromX(-1), 0.48);
});

test("red lines clamp inside the frame", () => {
  assert.equal(redFromY(-0.2), 0.02);
  assert.equal(redFromY(1.4), 0.98);
  assert.equal(redFromY(0.33), 0.33);
});

test("guides convert to pixels on the captured image", () => {
  const px = guidesInPixels({ yellowOffset: 0.25, redA: 0.4, redB: 0.5 }, 1080, 1920);
  assert.deepEqual(px, { greenX: 540, yellowLeftX: 270, yellowRightX: 810, redAY: 768, redBY: 960 });
});

/** Build a landmark array for an upright, centred face, then apply tweaks. */
function face(tweak: Partial<Record<number, Pt>> = {}): Pt[] {
  const lm: Pt[] = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5 }));
  lm[LM.forehead] = { x: 0.5, y: 0.25 };
  lm[LM.chin] = { x: 0.5, y: 0.75 };
  lm[LM.noseTip] = { x: 0.5, y: 0.5 };
  lm[LM.cheekRight] = { x: 0.25, y: 0.5 };
  lm[LM.cheekLeft] = { x: 0.75, y: 0.5 };
  for (const [k, v] of Object.entries(tweak)) lm[Number(k)] = v as Pt;
  return lm;
}

test("an upright, centred face passes every check", () => {
  const pose = computePose(face(), 9 / 16);
  assert.ok(pose);
  assert.ok(Math.abs(pose.rollDeg) < 1e-9);
  assert.ok(allPass(evaluate(pose, { beta: 90, gamma: 0 })));
});

test("head tilt is detected from the midline, not the eyes", () => {
  // Forehead shifted image-right = screen-left in the mirrored preview.
  const pose = computePose(face({ [LM.forehead]: { x: 0.56, y: 0.25 } }), 9 / 16);
  assert.ok(pose && pose.rollDeg < -2);
  const roll = evaluate(pose, null).find((c) => c.id === "roll");
  assert.equal(roll?.ok, false);
  assert.match(roll!.fix, /right shoulder/);
});

test("turned face fails the yaw check with a direction", () => {
  // Nose moved image-left = screen-right in the mirrored preview.
  const pose = computePose(face({ [LM.noseTip]: { x: 0.45, y: 0.5 } }), 9 / 16);
  const yaw = evaluate(pose, null).find((c) => c.id === "yaw");
  assert.equal(yaw?.ok, false);
  assert.match(yaw!.fix, /to your left/);
});

test("off-centre face fails the centre check", () => {
  const lm = face();
  for (const i of [LM.forehead, LM.chin, LM.noseTip, LM.cheekLeft, LM.cheekRight]) lm[i] = { ...lm[i], x: lm[i].x + 0.06 };
  const centre = evaluate(computePose(lm, 9 / 16), null).find((c) => c.id === "centre");
  assert.equal(centre?.ok, false);
});

test("phone tilt blocks capture; a missing sensor does not", () => {
  const pose = computePose(face(), 9 / 16);
  assert.equal(allPass(evaluate(pose, { beta: 75, gamma: 0 })), false);
  assert.equal(allPass(evaluate(pose, { beta: 90, gamma: 6 })), false);
  assert.equal(allPass(evaluate(pose, null)), true);
});

test("no face means no capture", () => {
  assert.equal(allPass(evaluate(null, null)), false);
});
