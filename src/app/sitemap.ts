import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { products, collections } from "@/lib/products";

const BASE_URL = "https://shimmyhands.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/availability`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/brows`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/brows/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/brows/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/nails`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/nails/shop`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/links`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const collectionPages: MetadataRoute.Sitemap = collections.map((col) => ({
    url: `${BASE_URL}/nails/shop/${col.handle}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/nails/shop/${product.collectionHandle}/${product.handle}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...collectionPages, ...productPages];
}
