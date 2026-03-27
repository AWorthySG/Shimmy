import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
