import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // PWA / service worker は Phase 3 で @serwist/next 等を検討
  },
};

export default nextConfig;
