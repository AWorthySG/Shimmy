import type { Metadata } from "next";

/** The one public address of the site. The bare domain redirects here. */
export const SITE_URL = "https://www.shimmyhands.com";
export const SITE_NAME = "Shimmyhands";
export const DEFAULT_OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630 };
const MAX_DESCRIPTION = 160;

/** Trim to at most `max` characters on a word boundary, ending with an ellipsis. */
export function clampDescription(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:—–-]+$/, "") + "…";
}

interface PageMetaInput {
  title: string;
  description: string;
  /** Route path, e.g. "/blog/aftercare". Used for canonical and og:url. */
  path: string;
  /** Path or absolute URL of the share image; defaults to the site image. */
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

/** Complete metadata for a page: canonical, Open Graph and Twitter in one place. */
export function pageMeta({ title, description, path, image, type = "website", noindex }: PageMetaInput): Metadata {
  const desc = clampDescription(description);
  const images = [image ? { url: image } : DEFAULT_OG_IMAGE];
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: { title, description: desc, url: path, siteName: SITE_NAME, locale: "en_SG", type, images },
    twitter: { card: "summary_large_image", title, description: desc, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
