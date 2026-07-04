import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use sourcesMapStore for reliable source maps
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while it's setting up Sentry.
  debug: false,
})
