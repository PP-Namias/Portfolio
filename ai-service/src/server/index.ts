import { serve } from '@hono/node-server';

import { getEnv } from '../config/env';
import { logger } from '../lib/logger';
import { buildApp } from './app';

const env = getEnv();

const server = serve(
  { fetch: buildApp().fetch, port: env.port, hostname: env.host },
  (info) => {
    logger.info({ port: info.port, host: env.host }, 'ai-service listening');
  },
);

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    logger.info({ signal }, 'shutting down');
    server.close(() => {
      process.exit(0);
    });
  });
}
