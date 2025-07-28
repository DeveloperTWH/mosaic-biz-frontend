import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'mosiac-biz-hub.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: "https", // ✅ Add this
        hostname: "example.com",
      },

    ],
  },
};

export default nextConfig;
