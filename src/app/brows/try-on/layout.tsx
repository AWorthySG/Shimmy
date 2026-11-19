import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: '/brows/try-on' },
  title: { absolute: "Brow try-on | See your future brows | Shimmy" },
  description:
    "See how embroidery, nano, microblading or ombre powder brows would look on you. Free and instant; your photo never leaves your device.",
  openGraph: {
    title: "Brow try-on | See your future brows | Shimmy",
    description:
      "Upload a photo to see how new brows would look on you. It's free and instant, and your photo stays private.",
    url: "https://www.shimmyhands.com/brows/try-on",
    siteName: "Shimmy",
    locale: "en_SG",
    type: "website",

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function TryOnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
