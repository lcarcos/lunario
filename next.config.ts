import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // No React Compiler in this setup
  },
  // Ensure image domains if needed
  images: {
    domains: [],
  },
};

export default nextConfig;
