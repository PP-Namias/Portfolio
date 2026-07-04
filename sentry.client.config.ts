import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use sourcesMapStore for reliable source maps
  tracesSampleRate: 0.2,

  // Set environment for proper error grouping
  environment: process.env.NODE_ENV || 'development',

  // Set release for source map association
  release: process.env.SENTRY_RELEASE || 'namias-portfolio@latest',

  // Filter out known noisy third-party errors
  denyUrls: [
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://googletagmanager.com',
    'https://www.googletagmanager.com',
    'https://connect.facebook.net',
    'https://platform.twitter.com',
    'https://snap.licdn.com',
    'https://sc-static.net',
  ],

  // Limit breadcrumbs to reduce memory usage
  maxBreadcrumbs: 50,

  // Setting this option to true will print useful information to the console while it's setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay integration:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
