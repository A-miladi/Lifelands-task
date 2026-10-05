import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lifelands.ir",
        pathname: "/**",
      },
    ],
  },
};

export default config;
