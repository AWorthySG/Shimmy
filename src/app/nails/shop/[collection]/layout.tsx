import type { Metadata } from "next";
import { collections, getCollectionByHandle } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ collection: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  const c = getCollectionByHandle(collection);
  if (!c) return { title: "Collection not found", robots: { index: false } };
  const meta = pageMeta({
    title: `${c.title} Press-On Nails`,
    description: c.description,
    path: `/nails/shop/${c.handle}`,
    image: c.image,
  });
  // Keep the section's brand suffix flowing down to product pages.
  return { ...meta, title: { absolute: `${c.title} Press-On Nails | Shimmyhands`, template: "%s | Shimmyhands" } };
}

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.handle }));
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
