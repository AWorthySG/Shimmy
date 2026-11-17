/**
 * Pure geometry for the guided brow selfie (/brows/selfie).
 *
 * All positions are fractions of the camera frame (0..1), so they map
 * directly onto the captured image: x * imageWidth, y * imageHeight.
 *
 * Face checks deliberately avoid the eyes. The photo is used to measure
 * eye height and size differences, so an eye-based tilt check would
 * "correct" the very asymmetry being measured. Tilt and turn are taken
 * from the forehead–chin midline and the cheek edges instead.
 */

export type Pt = { x: number; y: number };

export interface GuideLines {
  /** Distance of each yellow line from the green centre line (fraction of width). */
  yellowOffset: number;
  /** Upper and lower red lines (fraction of height). Order is not enforced. */
  redA: number;
  redB: number;
}

export const DEFAULT_GUIDES: GuideLines = {
  yellowOffset: 0.16,
  redA: 0.4,
  redB: 0.47,
};

export const YELLOW_MIN = 0.02;
export const YELLOW_MAX = 0.48;
export const RED_MIN = 0.02;
export const RED_MAX = 0.98;

export const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * Yellow lines move as a mirrored pair. Dragging either line to x sets
 * the shared offset to |x - 0.5|, so both lines stay equidistant from
 * the green centre line.
 */
export function yellowOffsetFromX(x: number): number {
  return clamp(Math.abs(x - 0.5), YELLOW_MIN, YELLOW_MAX);
}

export function yellowPositions(offset: number): [number, number] {
  return [0.5 - offset, 0.5 + offset];
}

export function redFromY(y: number): number {
  return clamp(y, RED_MIN, RED_MAX);
}

/** Guide lines converted to pixel positions on an image of size w × h. */
export function guidesInPixels(g: GuideLines, w: number, h: number) {
  const [yl, yr] = yellowPositions(g.yellowOffset);
  return {
    greenX: Math.round(0.5 * w),
    yellowLeftX: Math.round(yl * w),
    yellowRightX: Math.round(yr * w),
    redAY: Math.round(g.redA * h),
    redBY: Math.round(g.redB * h),
  };
}

/* ─────────────── Face pose ─────────────── */

/** MediaPipe FaceLandmarker (478-point) indices used by the checks. */
export const LM = {
  forehead: 10,
  chin: 152,
  noseTip: 1,
  cheekRight: 234, // subject's right, image-left in an unmirrored frame
  cheekLeft: 454,
} as const;

export interface FacePose {
  /** Head tilt in degrees. Positive = top of head leans to screen-right in the mirrored preview. */
  rollDeg: number;
  /** Nose offset from the cheek midpoint, as a fraction of face width. Negative = nose to screen-left. */
  yaw: number;
  /** Face centre x in mirrored screen coordinates (0..1). */
  centreX: number;
  /** Cheek-to-cheek width as a fraction of frame width. */
  faceWidth: number;
}

/**
 * Compute pose from normalised landmarks of an UNMIRRORED frame.
 * Results are expressed in MIRRORED screen space, which is what the
 * customer sees, so the guidance text matches the preview.
 * `aspect` = frameWidth / frameHeight, needed for a true angle.
 */
export function computePose(lm: Pt[], aspect: number): FacePose | null {
  const need = [LM.forehead, LM.chin, LM.noseTip, LM.cheekRight, LM.cheekLeft];
  if (need.some((i) => !lm[i])) return null;
  const m = (p: Pt): Pt => ({ x: 1 - p.x, y: p.y });

  const top = m(lm[LM.forehead]);
  const bottom = m(lm[LM.chin]);
  const nose = m(lm[LM.noseTip]);
  const c1 = m(lm[LM.cheekRight]);
  const c2 = m(lm[LM.cheekLeft]);

  const dx = (top.x - bottom.x) * aspect;
  const dy = bottom.y - top.y;
  const rollDeg = (Math.atan2(dx, dy) * 180) / Math.PI;

  const faceWidth = Math.abs(c2.x - c1.x);
  const midX = (c1.x + c2.x) / 2;
  const yaw = faceWidth > 0 ? (nose.x - midX) / faceWidth : 0;
  const centreX = (top.x + bottom.x) / 2;

  return { rollDeg, yaw, centreX, faceWidth };
}

export interface Tilt {
  /** Front–back tilt. 90 = phone upright. */
  beta: number;
  /** Side-to-side tilt. 0 = phone upright in portrait. */
  gamma: number;
}

export const LIMITS = {
  rollDeg: 2,
  yaw: 0.04,
  centre: 0.025,
  faceMin: 0.38,
  faceMax: 0.75,
  phoneSide: 3,
  phonePitch: 6,
};

export type CheckId = "face" | "distance" | "centre" | "roll" | "yaw" | "phoneSide" | "phonePitch";

export interface Check {
  id: CheckId;
  ok: boolean;
  /** Instruction to show when the check fails. */
  fix: string;
  label: string;
}

/**
 * Evaluate every capture condition. `tilt` is null when the device
 * has no motion sensor (e.g. a laptop); phone checks then pass.
 */
export function evaluate(pose: FacePose | null, tilt: Tilt | null): Check[] {
  const checks: Check[] = [];

  if (!pose) {
    checks.push({
      id: "face",
      ok: false,
      label: "Face found",
      fix: "Face the camera so your whole face is in view.",
    });
  } else {
    const tooSmall = pose.faceWidth < LIMITS.faceMin;
    const tooBig = pose.faceWidth > LIMITS.faceMax;
    checks.push({
      id: "distance",
      ok: !tooSmall && !tooBig,
      label: "Distance",
      fix: tooSmall ? "Bring the phone a little closer." : "Move the phone a little further away.",
    });

    const off = pose.centreX - 0.5;
    checks.push({
      id: "centre",
      ok: Math.abs(off) <= LIMITS.centre,
      label: "Centred on green line",
      fix: off < 0 ? "Move your face slightly to your right." : "Move your face slightly to your left.",
    });

    checks.push({
      id: "roll",
      ok: Math.abs(pose.rollDeg) <= LIMITS.rollDeg,
      label: "Head level",
      fix:
        pose.rollDeg > 0
          ? "Tilt your head slightly towards your left shoulder."
          : "Tilt your head slightly towards your right shoulder.",
    });

    checks.push({
      id: "yaw",
      ok: Math.abs(pose.yaw) <= LIMITS.yaw,
      label: "Facing straight",
      fix:
        pose.yaw < 0
          ? "Turn your face slightly to your right."
          : "Turn your face slightly to your left.",
    });
  }

  if (tilt) {
    checks.push({
      id: "phoneSide",
      ok: Math.abs(tilt.gamma) <= LIMITS.phoneSide,
      label: "Phone straight",
      fix: "Hold the phone straight. It is leaning to one side.",
    });
    const pitch = tilt.beta - 90;
    checks.push({
      id: "phonePitch",
      ok: Math.abs(pitch) <= LIMITS.phonePitch,
      label: "Phone upright",
      fix:
        pitch < 0
          ? "Tilt the top of the phone towards you until it is upright."
          : "Tilt the top of the phone away from you until it is upright.",
    });
  }

  return checks;
}

export const allPass = (checks: Check[]) => checks.every((c) => c.ok);

/* ─────────────── Real-world scale ─────────────── */

/**
 * Average adult horizontal iris diameter (HVID), about 11.7 mm with little
 * variation between people. Used to convert pixels to millimetres.
 */
export const IRIS_MM = 11.7;

/** FaceLandmarker iris ring points: [left edge, right edge] of each iris. */
const IRIS_RINGS: [number, number][] = [
  [469, 471],
  [474, 476],
];

/**
 * Millimetres per pixel from the iris width, or null when the iris
 * landmarks are missing. `w`, `h` are the image size in pixels.
 */
export function irisMmPerPx(lm: Pt[], w: number, h: number): number | null {
  const widths: number[] = [];
  for (const [a, b] of IRIS_RINGS) {
    if (!lm[a] || !lm[b]) continue;
    const dx = (lm[a].x - lm[b].x) * w;
    const dy = (lm[a].y - lm[b].y) * h;
    const d = Math.hypot(dx, dy);
    if (d > 0) widths.push(d);
  }
  if (!widths.length) return null;
  const avg = widths.reduce((s, v) => s + v, 0) / widths.length;
  return IRIS_MM / avg;
}

/* ─────────────── WhatsApp hand-off ─────────────── */

export interface ShotSummary {
  source: "camera" | "library";
  width: number;
  height: number;
  /** Labels of checks that failed; empty when all passed. null when not checked. */
  failed: string[] | null;
  /** From computePose: positive = head tilted to the customer's right. */
  rollDeg?: number | null;
  /** From computePose: positive = face turned to the customer's right. */
  yaw?: number | null;
  /** Cheek-to-cheek width as a fraction of image width. */
  faceWidth?: number | null;
  mmPerPx?: number | null;
}

/** Plain-language direction from the customer's point of view. */
export function describeTilt(rollDeg: number): string {
  if (Math.abs(rollDeg) < 0.05) return "0.0° (level)";
  const side = rollDeg > 0 ? "right" : "left";
  return `${Math.abs(rollDeg).toFixed(1)}° towards the customer's ${side} shoulder`;
}

export function describeTurn(yaw: number): string {
  if (Math.abs(yaw) < 0.0005) return "0.0% (straight)";
  const side = yaw > 0 ? "right" : "left";
  return `nose ${(Math.abs(yaw) * 100).toFixed(1)}% of face width towards the customer's ${side}`;
}

/**
 * Text sent alongside the photo on WhatsApp. Guide positions are given as
 * percentages because WhatsApp may resize the image; the mm scale is
 * resolution-independent once multiplied by the received image's width ratio.
 */
export function whatsappMessage(name: string, s: ShotSummary, g: GuideLines): string {
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const [yl, yr] = yellowPositions(g.yellowOffset);
  const checks =
    s.failed === null
      ? "Checks: not run"
      : s.failed.length === 0
        ? "Checks: all passed"
        : `Checks NOT passed: ${s.failed.join(", ")}`;
  const scale =
    s.mmPerPx != null
      ? `Scale: ${s.mmPerPx.toFixed(4)} mm/px at ${s.width}px wide (iris = ${IRIS_MM} mm)`
      : "Scale: not available (iris not detected)";
  const faceMm =
    s.mmPerPx != null && s.faceWidth != null
      ? `Face width (cheek to cheek): ~${Math.round(s.faceWidth * s.width * s.mmPerPx)} mm`
      : "";
  return [
    `Brow mapping selfie – ${name.trim()}`,
    `Source: ${s.source === "camera" ? "guided camera" : "photo library"} (${s.width}×${s.height}px)`,
    s.source === "camera"
      ? "Orientation: not mirrored (customer's right eye is on the image left)"
      : "Orientation: UNKNOWN – library selfies are often mirrored; confirm left/right before measuring",
    checks,
    s.rollDeg != null ? `Head tilt: ${describeTilt(s.rollDeg)}` : "",
    s.yaw != null ? `Head turn: ${describeTurn(s.yaw)}` : "",
    scale,
    faceMm,
    `Guides (from left/top): yellow ${pct(yl)} / ${pct(yr)}, red ${pct(g.redA)} / ${pct(g.redB)}`,
  ]
    .filter(Boolean)
    .join("\n");
}
