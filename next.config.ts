import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_51Tez7RGWolWdiG7QYECuvcizBsIqhDu6Vg5Y39fI0BNfY7LPNeIp7ofCFceIH2Xf5SRZMWHQ6BFZ5HJ9JIVeHH2X00v1c9o7my',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
      ],
    },
    {
      source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/(.*)\\.(js|css)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  allowedDevOrigins: [
    "192.168.1.24:3000",
    "192.168.1.24",
    "localhost:3000",
    "192.168.1.24:*",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Limit workers to save RAM during build
    memoryBasedWorkersCount: true,
    cpus: 1,
  },
  // Disable ESLint during build to save memory (run locally instead)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checks during build to save memory (run locally instead)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
