import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-vercel-skip-toolbar',
            value: '1',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
