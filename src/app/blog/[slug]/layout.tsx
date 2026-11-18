import type { Metadata } from "next";
import { blogPosts, getPostBySlug } from "@/lib/blog";
import { en } from "@/lib/i18n-en";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return pageMeta({
    title: en[post.titleKey] ?? "Beauty Journal",
    description: en[post.descKey] ?? "",
    path: `/blog/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
