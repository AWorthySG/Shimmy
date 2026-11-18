import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  title: { absolute: "Privacy Policy | Shimmy" },
  robots: { index: false, follow: false },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
