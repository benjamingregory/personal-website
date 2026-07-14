import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Private dashboard behind basic auth — never index.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
