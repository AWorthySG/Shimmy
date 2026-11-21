import type { ShowcaseItem } from "@/components/ShowcaseStrip";

export const BROW_SHOWCASE: ShowcaseItem[] = [
  { src: "/images/brows/brow-result-hairstroke-1.jpg", alt: "Nano brow hair strokes, close up", caption: "Nano brows", href: "/brows/services/nano-brows" },
  { src: "/images/brows/brow-result-eyes-detail.jpg", alt: "Soft powdered ombre brows", caption: "Ombre powder brows", href: "/brows/services/ombre-powder-brows" },
  { src: "/images/brows/brow-process-hand.jpg", alt: "Eyebrow embroidery in progress", caption: "Embroidery in progress", href: "/brows/services/eyebrow-embroidery" },
  { src: "/images/brows/brow-result-hairstroke-soft.jpg", alt: "Soft hair-stroke brows", caption: "Soft hair strokes", href: "/brows/gallery" },
  { src: "/images/brows/brow-result-healed.jpg", alt: "Healed brows a few weeks after the session", caption: "Healed result", href: "/brows/gallery" },
  { src: "/images/brows/brow-result-side-profile.jpg", alt: "Brows from the side", caption: "Side profile", href: "/brows/gallery" },
  { src: "/images/brows/brow-result-misty-1.jpg", alt: "Misty powder brows", caption: "Misty finish", href: "/brows/gallery" },
];

export const NAIL_SHOWCASE: ShowcaseItem[] = [
  { src: "/images/nails/lovers-onhand-1.jpg", alt: "Lovers press-on nails worn on the hand", caption: "Lovers", href: "/nails/shop" },
  { src: "/images/nails/ingenue-lifestyle.jpg", alt: "Ingenue press-on nails styled", caption: "Ingenue", href: "/nails/shop" },
  { src: "/images/nails/main-festive-mulled-wine.jpg", alt: "Mulled wine festive press-on nails", caption: "Mulled wine", href: "/nails/shop" },
  { src: "/images/nails/lifestyle-onhand-2.jpg", alt: "Press-on nails worn day to day", caption: "On the hand", href: "/nails/shop" },
  { src: "/images/nails/lovers-2-galaxy.jpg", alt: "Galaxy-detail press-on nails", caption: "Galaxy detail", href: "/nails/shop" },
  { src: "/images/nails/christmas-2-evergreen.jpg", alt: "Evergreen festive press-on nails", caption: "Evergreen", href: "/nails/shop" },
];

/** Home page: alternate brows and nails. */
export const HOME_SHOWCASE: ShowcaseItem[] = BROW_SHOWCASE.slice(0, 4).flatMap((b, i) =>
  NAIL_SHOWCASE[i] ? [b, NAIL_SHOWCASE[i]] : [b],
);
