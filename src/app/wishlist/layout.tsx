import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Your wishlist",
  description: "Press-on nail sets you have saved at Shimmyhands.",
  path: "/wishlist",
  noindex: true,
});

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
