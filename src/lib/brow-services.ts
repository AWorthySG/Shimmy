/**
 * One landing page per brow service at /brows/services/<slug>.
 * Visible text comes from the svc.*, compare.* and faq.svc.* i18n keys, so the
 * pages stay in step with the services list. The SEO title and description
 * below are English-only search snippets.
 */
export interface BrowService {
  /** Matches svc.<id>.* and compare.*.<id> keys and the booking service id. */
  id: "embroidery" | "microblading" | "nano" | "ombre" | "shaping" | "lip";
  slug: string;
  /** Prefix for faq.svc.<faq>.<n>.q/a keys. */
  faq: string;
  /** Photo of this service. Lip blush has none yet, so its page shows no hero photo. */
  image?: string;
  seoTitle: string;
  seoDescription: string;
}

export const BROW_SERVICES: BrowService[] = [
  {
    id: "embroidery",
    slug: "eyebrow-embroidery",
    faq: "emb",
    image: "/images/brows/brow-process-spoolie.jpg",
    seoTitle: "Eyebrow embroidery in Singapore: price, process and aftercare",
    seoDescription:
      "Eyebrow embroidery at Shimmy Beauty Studio, Singapore. Fine hair strokes made with a hand blade, from S$388. Takes 2 to 2.5 hours and lasts 12 to 18 months.",
  },
  {
    id: "microblading",
    slug: "microblading",
    faq: "mic",
    image: "/images/brows/brow-result-hairstroke-2.jpg",
    seoTitle: "Microblading in Singapore: price, process and aftercare",
    seoDescription:
      "Microblading at Shimmy Beauty Studio, Singapore, from S$488. Crisp hair strokes for normal to dry skin. Takes 2 to 2.5 hours and lasts 12 to 18 months.",
  },
  {
    id: "nano",
    slug: "nano-brows",
    faq: "nano",
    image: "/images/brows/brow-result-side-profile.jpg",
    seoTitle: "Nano brows in Singapore: price, process and aftercare",
    seoDescription:
      "Nano brows at Shimmy Beauty Studio, Singapore, from S$588. Ultra-fine machine hair strokes that last 18 to 24 months. Takes 2 to 3 hours.",
  },
  {
    id: "ombre",
    slug: "ombre-powder-brows",
    faq: "ombre",
    image: "/images/brows/brow-result-eyes-detail.jpg",
    seoTitle: "Ombre powder brows in Singapore: price, process and aftercare",
    seoDescription:
      "Ombre powder brows at Shimmy Beauty Studio, Singapore, from S$488. A soft powdered finish that suits oily skin and lasts 2 to 3 years.",
  },
  {
    id: "shaping",
    slug: "brow-shaping",
    faq: "shp",
    image: "/images/brows/brow-result-clean-front.jpg",
    seoTitle: "Brow shaping in Singapore: mapping, threading and waxing",
    seoDescription:
      "Brow shaping and mapping at Shimmy Beauty Studio, Singapore, from S$48. Threading, waxing or both, shaped to your face. Takes 30 to 45 minutes.",
  },
  {
    id: "lip",
    slug: "lip-blush",
    faq: "lip",
    seoTitle: "Lip blush in Singapore: price, healing and aftercare",
    seoDescription:
      "Lip blush at Shimmy Beauty Studio, Singapore, from S$488. Semi-permanent lip colour. Healing takes 4 to 6 weeks and the true colour shows around week 3 to 4.",
  },
];

export function getBrowService(slug: string): BrowService | undefined {
  return BROW_SERVICES.find((s) => s.slug === slug);
}

/** i18n keys a service page reads, in display order. */
export function serviceKeys(s: BrowService) {
  return {
    title: `svc.${s.id}.title`,
    price: `svc.${s.id}.price`,
    duration: `svc.${s.id}.duration`,
    desc: `svc.${s.id}.desc`,
    includes: [1, 2, 3, 4].map((n) => `svc.${s.id}.inc.${n}`),
    longevity: `compare.longevity.${s.id}`,
    faqs: [1, 2].map((n) => ({ q: `faq.svc.${s.faq}.${n}.q`, a: `faq.svc.${s.faq}.${n}.a` })),
  };
}
