/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'crests.football-data.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'resources.premierleague.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security',  value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control',     value: 'on' },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/analysis',       destination: '/news',       permanent: false },
      { source: '/players',        destination: '/teams',      permanent: false },
      { source: '/news/breaking',  destination: '/news',       permanent: false },
      { source: '/search',         destination: '/news',       permanent: false },
      { source: '/privacy-policy', destination: '/privacy',    permanent: true  },
      { source: '/terms-of-service', destination: '/terms',    permanent: true  },
      { source: '/about-us',       destination: '/about',      permanent: true  },
    ];
  },
  async rewrites() {
    const apiUrl = process.env.API_URL
      || process.env.NEXT_PUBLIC_API_URL
      || 'https://renewed-ambition-production-ea0a.up.railway.app';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
