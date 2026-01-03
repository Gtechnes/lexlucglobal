import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    optimizePackageImports: ["@nextui-org/react"],
  },
};

export default nextConfig;
