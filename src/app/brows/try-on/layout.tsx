import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brow Try-On | See Your Future Brows | Shimmy",
  description:
    "Upload a photo and see how your brows would look with eyebrow embroidery, nano brows, microblading, or ombre powder. Free, instant, private — your photo stays on your device.",
  openGraph: {
    title: "Brow Try-On | See Your Future Brows | Shimmy",
    description:
      "Upload a photo and see how your brows would look. Free, instant, private.",
    url: "https://shimmyhands.com/brows/try-on",
    siteName: "Shimmy",
    locale: "en_SG",
    type: "website",
  },
};

export default function TryOnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
