/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/jupag/:path*',
        destination: 'https://tokens.jup.ag/:path*',
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ['tweetnacl', 'bs58']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
