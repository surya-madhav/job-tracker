/** @type {import('next').NextConfig} */

const nextConfig = {  
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        path: false,
        stream: false,
        util: false,
        crypto: false,
        process: false,
        buffer: false
      }
    }
    return config
}
};

module.exports = nextConfig;