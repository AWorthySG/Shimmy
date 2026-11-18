import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: '/brows/try-on' },
  title: { absolute: "Brow Try-On | See Your Future Brows | Shimmy" },
  description:
    "See how embroidery, nano, microblading or ombre powder brows would look on you. Free and instant; your photo never leaves your device.",
  openGraph: {
    title: "Brow Try-On | See Your Future Brows | Shimmy",
    description:
      "Upload a photo and see how your brows would look. Free, instant, private.",
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
