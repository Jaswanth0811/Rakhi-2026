import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/rakhi",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/rakhi/admin",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/rakhi/admin/:path*",
      },
    ];
  },
};

export default nextConfig;
