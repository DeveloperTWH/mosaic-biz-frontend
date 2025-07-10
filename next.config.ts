import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "my-bucket.s3.amazonaws.com"], // replace with your S3 domain
  },
};

export default nextConfig;
