import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "mosiac-biz-hub.s3.us-east-1.amazonaws.com" },
      { protocol: "https", hostname: "mosaic-biz-hub.s3.us-east-1.amazonaws.com" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "s3.amazonaws.com", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/products/:productid/:id", destination: "/product/:id", permanent: true },
      { source: "/products/:productid", destination: "/products", permanent: true },
      { source: "/services/:id/:serviceId", destination: "/vendor-profile/service-vendor/:serviceId", permanent: true },
      { source: "/foods/resturant/:id", destination: "/foods", permanent: true },
      { source: "/foods/shop/:id", destination: "/foods", permanent: true },
      { source: "/vendors/:vendor_id", destination: "/vendor-profile/product-vendor/:vendor_id", permanent: true },
    ];
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
