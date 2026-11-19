import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Studio hours and availability",
  description:
    "Shimmy Beauty Studio opening hours and appointment availability for brow embroidery in Singapore. Message us on WhatsApp to book a slot.",
  path: "/availability",
});

export default function AvailabilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
