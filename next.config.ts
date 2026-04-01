import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 5184000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "*.pexels.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/services", destination: "/brows/services", permanent: true },
      { source: "/gallery", destination: "/brows/gallery", permanent: true },
    ];
  },
};

export default nextConfig;
