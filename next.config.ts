import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: process.env.BASE_PATH,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yunquetai.com",
      },
    ],
  },
};

export default nextConfig;
