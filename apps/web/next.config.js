/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
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
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'X-DNS-Prefetch-Control',     value: 'on' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://renewed-ambition-production-ea0a.up.railway.app wss://renewed-ambition-production-ea0a.up.railway.app https://www.google-analytics.com",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' mailto:",
            ].join('; '),
          },
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
      // Legacy URL redirects (canonical slug redirects)
      { source: '/news/breaking',    destination: '/news',    permanent: false },
      { source: '/privacy-policy',   destination: '/privacy', permanent: true  },
      { source: '/terms-of-service', destination: '/terms',   permanent: true  },
      { source: '/about-us',         destination: '/about',   permanent: true  },
      // /analysis, /players, /search now have real pages — redirects removed
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
