import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: false },
  images: {
    domains: ['i.dell.com', 'www.dell.com'],
  },
};

export default nextConfig;
