// Brow style configurations for the try-on visualizer.
// Each style defines an SVG path that's drawn within the detected brow
// bounding box (the right brow is mirrored horizontally so paths describe
// the *left* brow shape in viewer coordinates).
//
// Coordinates are in a 0–100 space and get scaled to the detected brow region.

export type BrowDensity = "light" | "medium" | "bold";
export type BrowService =
  | "nano"
  | "microblading"
  | "ombre"
  | "embroidery";

export type FaceShape = "oval" | "round" | "square" | "heart" | "long";

export interface BrowStyle {
  id: string;
  nameKey: string; // i18n key like "tryon.style.nano-soft"
  /** i18n key for a one-sentence description shown under the style name. */
  descKey: string;
  service: BrowService;
  /** SVG path data in a 0–100 box for ONE brow (the inner edge at x=0, tail at x=100). */
  pathData: string;
  density: BrowDensity;
  /** Hex colour used as the base brow tone (default brown). */
  color: string;
  /** Optional blend mode override for compositing onto the photo. */
  blendMode?: GlobalCompositeOperation;
  /** Price in SGD (from) — used in the picker. */
  priceFrom: number;
  /** i18n key for the longevity copy, e.g. "12–18 months". */
  longevityKey: string;
  /** Rough "tried this month" count for social proof. */
  triedThisMonth: number;
  /** Face shapes this style flatters most. */
  recommendedFor: FaceShape[];
  /** Whether this is the studio's most-booked style. */
  isPopular?: boolean;
}

/** Selectable brow tones — affects rendered overlay colour. */
export interface BrowColor {
  id: string;
  nameKey: string;
  /** Hex used to override BrowStyle.color when this tone is picked. */
  color: string;
}

export const BROW_COLORS: BrowColor[] = [
  { id: "auburn", nameKey: "tryon.color.auburn", color: "#6B3A1F" },
  { id: "soft-brown", nameKey: "tryon.color.soft-brown", color: "#5A3D2A" },
  { id: "rich-brown", nameKey: "tryon.color.rich-brown", color: "#3D2820" },
  { id: "espresso", nameKey: "tryon.color.espresso", color: "#2A1810" },
  { id: "black-brown", nameKey: "tryon.color.black-brown", color: "#1A1008" },
];

// Realistic brow tones — deep cool-brown to soft warm taupe.
const TONE_DEEP = "#2A1810"; // espresso
const TONE_RICH = "#3D2820"; // dark brown
const TONE_SOFT = "#5A3D2A"; // warm medium brown

export const BROW_STYLES: BrowStyle[] = [
  {
    id: "nano-soft",
    nameKey: "tryon.style.nano-soft",
    descKey: "tryon.style.nano-soft.desc",
    service: "nano",
    pathData:
      "M 4 62 Q 22 50, 42 38 Q 60 30, 76 36 Q 90 42, 96 54",
    density: "light",
    color: TONE_SOFT,
    blendMode: "multiply",
    priceFrom: 588,
    longevityKey: "tryon.longevity.nano",
    triedThisMonth: 24,
    recommendedFor: ["oval", "heart", "long"],
  },
  {
    id: "nano-defined",
    nameKey: "tryon.style.nano-defined",
    descKey: "tryon.style.nano-defined.desc",
    service: "nano",
    pathData:
      "M 3 64 Q 20 52, 40 36 Q 58 26, 78 34 Q 92 40, 97 56",
    density: "medium",
    color: TONE_RICH,
    blendMode: "multiply",
    priceFrom: 588,
    longevityKey: "tryon.longevity.nano",
    triedThisMonth: 18,
    recommendedFor: ["square", "round"],
  },
  {
    id: "microblading-feathered",
    nameKey: "tryon.style.microblading-feathered",
    descKey: "tryon.style.microblading-feathered.desc",
    service: "microblading",
    pathData:
      "M 4 60 Q 24 52, 46 42 Q 64 36, 80 42 Q 92 46, 96 56",
    density: "light",
    color: TONE_RICH,
    blendMode: "multiply",
    priceFrom: 528,
    longevityKey: "tryon.longevity.microblading",
    triedThisMonth: 14,
    recommendedFor: ["oval", "long"],
  },
  {
    id: "ombre-light",
    nameKey: "tryon.style.ombre-light",
    descKey: "tryon.style.ombre-light.desc",
    service: "ombre",
    pathData:
      "M 4 66 Q 22 54, 44 40 Q 62 32, 80 38 Q 92 44, 96 58",
    density: "medium",
    color: TONE_SOFT,
    blendMode: "multiply",
    priceFrom: 488,
    longevityKey: "tryon.longevity.ombre",
    triedThisMonth: 21,
    recommendedFor: ["oval", "round", "heart"],
  },
  {
    id: "ombre-bold",
    nameKey: "tryon.style.ombre-bold",
    descKey: "tryon.style.ombre-bold.desc",
    service: "ombre",
    pathData:
      "M 3 66 Q 20 52, 40 36 Q 58 26, 78 32 Q 92 38, 97 54",
    density: "bold",
    color: TONE_DEEP,
    blendMode: "multiply",
    priceFrom: 488,
    longevityKey: "tryon.longevity.ombre",
    triedThisMonth: 12,
    recommendedFor: ["square", "round"],
  },
  {
    id: "embroidery-classic",
    nameKey: "tryon.style.embroidery-classic",
    descKey: "tryon.style.embroidery-classic.desc",
    service: "embroidery",
    pathData:
      "M 4 62 Q 22 50, 42 38 Q 60 30, 80 36 Q 92 42, 96 56",
    density: "medium",
    color: TONE_RICH,
    blendMode: "multiply",
    priceFrom: 458,
    longevityKey: "tryon.longevity.embroidery",
    triedThisMonth: 32,
    recommendedFor: ["oval", "round", "square", "heart", "long"],
    isPopular: true,
  },
];

// ─── Face shape quiz ───

export interface QuizQuestion {
  id: string;
  promptKey: string;
  options: {
    id: string;
    labelKey: string;
    /** Vote weights per face shape; the highest sum wins. */
    weights: Partial<Record<FaceShape, number>>;
  }[];
}

export const FACE_SHAPE_QUIZ: QuizQuestion[] = [
  {
    id: "face-length",
    promptKey: "tryon.quiz.q1",
    options: [
      { id: "shorter", labelKey: "tryon.quiz.q1.a", weights: { round: 2, square: 1 } },
      { id: "balanced", labelKey: "tryon.quiz.q1.b", weights: { oval: 2, heart: 1 } },
      { id: "longer", labelKey: "tryon.quiz.q1.c", weights: { long: 2, oval: 1 } },
    ],
  },
  {
    id: "jawline",
    promptKey: "tryon.quiz.q2",
    options: [
      { id: "soft", labelKey: "tryon.quiz.q2.a", weights: { round: 2, oval: 1 } },
      { id: "angular", labelKey: "tryon.quiz.q2.b", weights: { square: 2, long: 1 } },
      { id: "tapered", labelKey: "tryon.quiz.q2.c", weights: { heart: 2, oval: 1 } },
    ],
  },
  {
    id: "preference",
    promptKey: "tryon.quiz.q3",
    options: [
      { id: "natural", labelKey: "tryon.quiz.q3.a", weights: { oval: 1, heart: 1, long: 1 } },
      { id: "polished", labelKey: "tryon.quiz.q3.b", weights: { round: 1, square: 1 } },
    ],
  },
];

export function resolveFaceShape(votes: Partial<Record<FaceShape, number>>): FaceShape {
  const all: FaceShape[] = ["oval", "round", "square", "heart", "long"];
  let best: FaceShape = "oval";
  let bestVotes = -1;
  for (const shape of all) {
    const v = votes[shape] ?? 0;
    if (v > bestVotes) {
      best = shape;
      bestVotes = v;
    }
  }
  return best;
}

export function recommendedStylesFor(shape: FaceShape): BrowStyle[] {
  return BROW_STYLES.filter((s) => s.recommendedFor.includes(shape));
}

/** Returns base alpha used when compositing a style of a given density. */
export function densityAlpha(density: BrowDensity): number {
  switch (density) {
    case "light":
      return 0.55;
    case "medium":
      return 0.72;
    case "bold":
      return 0.9;
  }
}

/** Returns the stroke-width (in 0-100 box units) used to render the style. */
export function densityStroke(density: BrowDensity): number {
  switch (density) {
    case "light":
      return 14;
    case "medium":
      return 18;
    case "bold":
      return 22;
  }
}
