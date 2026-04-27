import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (best compression), then WebP fallback
    formats: ["image/avif", "image/webp"],
    // Compress more aggressively — 75 is visually lossless for photos
    minimumCacheTTL: 31536000, // 1 year cache for optimised images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Common sizes used across the site — avoids generating redundant sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Compress all responses
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React strict mode for better hydration error detection
  reactStrictMode: true,
  // Experimental: faster builds with Turbopack (already default in Next 15)
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
