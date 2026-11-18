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
  whatsappMessage,
  irisMmPerPx,
  suggestGuides,
  GUIDE_LM,
  describeTilt,
  describeTurn,
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

test("iris width gives a mm-per-pixel scale", () => {
  const lm = face();
  // Each iris 0.02 of a 1000px-wide image = 20px wide -> 11.7 / 20 mm per px.
  lm[469] = { x: 0.40, y: 0.45 };
  lm[471] = { x: 0.42, y: 0.45 };
  lm[474] = { x: 0.58, y: 0.45 };
  lm[476] = { x: 0.60, y: 0.45 };
  const s = irisMmPerPx(lm, 1000, 1500);
  assert.ok(s !== null && Math.abs(s - 11.7 / 20) < 1e-9);
});

test("iris scale is null without iris landmarks", () => {
  assert.equal(irisMmPerPx(face().slice(0, 468), 1000, 1500), null);
});

test("tilt and turn are described from the customer's side", () => {
  // Forehead at image-right of an unmirrored frame = head leaning to the customer's left.
  const tilted = computePose(face({ [LM.forehead]: { x: 0.56, y: 0.25 } }), 9 / 16)!;
  assert.match(describeTilt(tilted.rollDeg), /customer's left shoulder/);
  // Nose at image-left of an unmirrored frame = face turned to the customer's right.
  const turned = computePose(face({ [LM.noseTip]: { x: 0.45, y: 0.5 } }), 9 / 16)!;
  assert.match(describeTurn(turned.yaw), /customer's right/);
});

test("WhatsApp message carries name, checks, direction, scale and guides", () => {
  const msg = whatsappMessage(
    " Mei Ling ",
    { source: "camera", width: 1080, height: 1920, failed: [], rollDeg: -0.84, yaw: 0.012, faceWidth: 0.5, mmPerPx: 0.25 },
    { yellowOffset: 0.2, redA: 0.4, redB: 0.475 },
  );
  assert.match(msg, /^Brow mapping selfie – Mei Ling$/m);
  assert.match(msg, /not mirrored/);
  assert.match(msg, /Checks: all passed/);
  assert.match(msg, /Head tilt: 0\.8° towards the customer's left shoulder/);
  assert.match(msg, /Head turn: nose 1\.2% of face width towards the customer's right/);
  assert.match(msg, /Scale: 0\.2500 mm\/px at 1080px wide/);
  assert.match(msg, /Face width \(cheek to cheek\): ~135 mm/);
  assert.match(msg, /Inner eye corners \(yellow\): 30\.0% and 70\.0% from left; gap 40\.0% of width \(~108\.0 mm\)/);
  assert.match(msg, /Brow line \(top red\): 40\.0% from top/);
  assert.match(msg, /Nostril base \(bottom red\): 47\.5% from top/);
  assert.match(msg, /Brow line to nostril base: 7\.5% of height \(~36\.0 mm\)/);
});

test("WhatsApp message warns that library photos may be mirrored", () => {
  const msg = whatsappMessage(
    "A",
    { source: "library", width: 900, height: 1200, failed: ["Head level", "Facing straight"] },
    { yellowOffset: 0.16, redA: 0.4, redB: 0.47 },
  );
  assert.match(msg, /Orientation: UNKNOWN/);
  assert.match(msg, /Checks NOT passed: Head level, Facing straight/);
  assert.match(msg, /Scale: not available/);
  assert.doesNotMatch(msg, /Head tilt|Head turn|Face width/);
});

test("lines are placed on the inner eye corners, brows and nostril base", () => {
  const lm = face();
  lm[GUIDE_LM.innerEyeRight] = { x: 0.44, y: 0.42 };
  lm[GUIDE_LM.innerEyeLeft] = { x: 0.57, y: 0.42 }; // slightly off-centre face
  for (const i of GUIDE_LM.brows) lm[i] = { x: 0.5, y: 0.35 };
  for (const i of GUIDE_LM.nostrilBase) lm[i] = { x: 0.5, y: 0.55 };
  const g = suggestGuides(lm)!;
  assert.ok(Math.abs(g.yellowOffset - 0.065) < 1e-9); // mean of 0.06 and 0.07
  assert.ok(Math.abs(g.redA - 0.35) < 1e-9);
  assert.ok(Math.abs(g.redB - 0.55) < 1e-9);
});

test("no line placement without landmarks", () => {
  assert.equal(suggestGuides(face().slice(0, 300)), null);
});

test("brow and nostril lines are labelled by position, whichever red line is which", () => {
  const msg = whatsappMessage(
    "A",
    { source: "camera", width: 1000, height: 1000, failed: [] },
    { yellowOffset: 0.1, redA: 0.6, redB: 0.3 },
  );
  assert.match(msg, /Brow line \(top red\): 30\.0% from top/);
  assert.match(msg, /Nostril base \(bottom red\): 60\.0% from top/);
  assert.doesNotMatch(msg, / mm\)/);
});
