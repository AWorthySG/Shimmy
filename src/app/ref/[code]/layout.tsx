import { pageMeta } from "@/lib/seo";

// Personal referral links: keep them out of search, point engines at the programme page.
export const metadata = pageMeta({
  title: "You're invited to Shimmy",
  description: "A friend has invited you to Shimmy Beauty Studio. Book your first brow session and you both get S$10 off.",
  path: "/referral",
  noindex: true,
});

export default function RefLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
