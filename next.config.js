/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';
const defaultUmamiScriptUrl = 'https://cloud.umami.is/script.js';
const defaultUmamiHostUrl = 'https://api-gateway.umami.dev';

const getOrigin = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return '';
  }
};

const umamiScriptOrigin = getOrigin(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || defaultUmamiScriptUrl);
const umamiHostOrigin = getOrigin(process.env.NEXT_PUBLIC_UMAMI_HOST_URL || defaultUmamiHostUrl);

const connectSrc = ["'self'", umamiHostOrigin].filter(Boolean).join(' ');
const isWindows = process.platform === 'win32';

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${umamiScriptOrigin ? ` ${umamiScriptOrigin}` : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data: https:;
  connect-src ${connectSrc} https://namias-cms.sanity.studio https://*.sanity.studio https://*.api.sanity.io;
  frame-src 'self' https://cal.com https://*.cal.com https://cdn.sanity.io https://namias-cms.sanity.studio https://*.sanity.studio;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self' https://namias-cms.sanity.studio https://*.sanity.studio;
  manifest-src 'self';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
  report-uri /api/csp-violation;
`;

const reportUri = '/api/csp-violation';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy.replaceAll(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },

  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    // Keep media delivery compatible with same-origin gateway responses and
    // other approved cross-origin embeds used by the site.
    value: 'cross-origin',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'credentialless',
  },
  {
    key: 'NEL',
    value: JSON.stringify({report_to: 'default', max_age: 2592000, include_subdomains: true}),
  },
];

const nextConfig = {
  output: isWindows ? undefined : 'standalone',
  poweredByHeader: false,
  devIndicators: {
    buildActivity: false,
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/?modal=blog',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/?modal=blog&slug=:slug',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '**.sanity.io' },
    ],
    localPatterns: [
      {pathname: '/api/media/sanity/**'},
      {pathname: '/og-image.svg'},
    ],
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
        ],
      },
      {
        source: '/og-image.svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
