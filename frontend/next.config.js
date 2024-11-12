/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true
  },
  swcMinify: true
};

module.exports = nextConfig;