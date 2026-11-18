import type { Metadata } from "next";
import { getProductBySlug, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ collection: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  return pageMeta({
    title: `${p.title} — ${formatPrice(p.price)}`,
    description: p.description,
    path: `/nails/shop/${p.collectionHandle}/${p.handle}`,
    image: p.images[0],
  });
}

export function generateStaticParams() {
  return products.map((p) => ({ collection: p.collectionHandle, slug: p.handle }));
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
