import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use sourcesMapStore for reliable source maps
  tracesSampleRate: 0.2,

  // Set environment for proper error grouping
  environment: process.env.NODE_ENV || 'development',

  // Set release for source map association
  release: process.env.SENTRY_RELEASE || 'namias-portfolio@latest',

  // Limit breadcrumbs to reduce memory usage
  maxBreadcrumbs: 50,

  // Setting this option to true will print useful information to the console while it's setting up Sentry.
  debug: false,
})
