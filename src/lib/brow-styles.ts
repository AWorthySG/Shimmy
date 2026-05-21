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

export interface BrowStyle {
  id: string;
  nameKey: string; // i18n key like "tryon.style.nano-soft"
  service: BrowService;
  /** SVG path data in a 0–100 box for ONE brow (the inner edge at x=0, tail at x=100). */
  pathData: string;
  density: BrowDensity;
  /** Hex colour used as the base brow tone. */
  color: string;
  /** Optional blend mode override for compositing onto the photo. */
  blendMode?: GlobalCompositeOperation;
}

// Realistic brow tones — deep cool-brown to soft warm taupe.
const TONE_DEEP = "#2A1810"; // espresso
const TONE_RICH = "#3D2820"; // dark brown
const TONE_SOFT = "#5A3D2A"; // warm medium brown

export const BROW_STYLES: BrowStyle[] = [
  {
    id: "nano-soft",
    nameKey: "tryon.style.nano-soft",
    service: "nano",
    // Gentle natural arch — slight peak around 60% across, soft tail.
    pathData:
      "M 4 62 Q 22 50, 42 38 Q 60 30, 76 36 Q 90 42, 96 54",
    density: "light",
    color: TONE_SOFT,
    blendMode: "multiply",
  },
  {
    id: "nano-defined",
    nameKey: "tryon.style.nano-defined",
    service: "nano",
    // Sharper arch peak, cleaner tail finish.
    pathData:
      "M 3 64 Q 20 52, 40 36 Q 58 26, 78 34 Q 92 40, 97 56",
    density: "medium",
    color: TONE_RICH,
    blendMode: "multiply",
  },
  {
    id: "microblading-feathered",
    nameKey: "tryon.style.microblading-feathered",
    service: "microblading",
    // Softer, more horizontal feathered shape with a low arch.
    pathData:
      "M 4 60 Q 24 52, 46 42 Q 64 36, 80 42 Q 92 46, 96 56",
    density: "light",
    color: TONE_RICH,
    blendMode: "multiply",
  },
  {
    id: "ombre-light",
    nameKey: "tryon.style.ombre-light",
    service: "ombre",
    // Fuller body with a soft front fade — the path is the upper outline.
    pathData:
      "M 4 66 Q 22 54, 44 40 Q 62 32, 80 38 Q 92 44, 96 58",
    density: "medium",
    color: TONE_SOFT,
    blendMode: "multiply",
  },
  {
    id: "ombre-bold",
    nameKey: "tryon.style.ombre-bold",
    service: "ombre",
    // Bold powder finish — thicker body and deeper colour.
    pathData:
      "M 3 66 Q 20 52, 40 36 Q 58 26, 78 32 Q 92 38, 97 54",
    density: "bold",
    color: TONE_DEEP,
    blendMode: "multiply",
  },
  {
    id: "embroidery-classic",
    nameKey: "tryon.style.embroidery-classic",
    service: "embroidery",
    // Classic embroidery — balanced arch, gentle taper at the tail.
    pathData:
      "M 4 62 Q 22 50, 42 38 Q 60 30, 80 36 Q 92 42, 96 56",
    density: "medium",
    color: TONE_RICH,
    blendMode: "multiply",
  },
];

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
