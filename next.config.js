/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/api/landing',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=31536000, immutable' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=31536000, immutable' },
        ],
      },
      {
        source: '/api/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=31536000, immutable' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=31536000, immutable' },
        ],
      },
      {
        source: '/api/sites/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=31536000, immutable' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
