import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Shimmy",
  robots: { index: false, follow: false },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
