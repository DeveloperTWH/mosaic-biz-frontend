import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com', // General S3 bucket access
        port: '',
        pathname: '/**', // Allows access to any path on this host
      },
      {
        protocol: 'https',
        // If your region is specified in the URL, use the full hostname
        hostname: 'https://www.istockphoto.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        // A common format for S3 is with the region specified in the URL
        hostname: '*www.istockphoto.com', // Allows any subdomain ending in amazonaws.com
        port: '',
        pathname: '/**',
      },
      

    ],
  },
  
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
