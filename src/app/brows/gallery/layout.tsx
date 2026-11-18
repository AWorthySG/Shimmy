import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Brow Gallery — Real Client Results",
  description:
    "Before-and-after photos of real Shimmy clients: nano brows, ombre powder brows and brow embroidery, each designed for the face it is on.",
  path: "/brows/gallery",
  image: "/images/brows/brow-before-after-1.jpg",
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
