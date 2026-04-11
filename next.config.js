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

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${umamiScriptOrigin ? ` ${umamiScriptOrigin}` : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data: https:;
  connect-src ${connectSrc};
  frame-src 'self' https://cal.com https://*.cal.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  manifest-src 'self';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
`;

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
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
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
    value: 'same-origin',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
];

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
