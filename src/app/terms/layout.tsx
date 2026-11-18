import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: '/terms' },
  title: { absolute: "Terms of Service | Shimmy" },
  robots: { index: false, follow: false },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
