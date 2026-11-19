import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  alternates: { canonical: '/brows/selfie' },
  title: { absolute: "Brow mapping selfie | Shimmyhands" },
  description: "Take a straight, level selfie for brow mapping before your appointment.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function SelfieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
