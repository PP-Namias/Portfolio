import { serve } from '@hono/node-server';

import { getEnv } from '../config/env';
import { logger } from '../lib/logger';
import { buildApp } from './app';

const env = getEnv();

serve(
  { fetch: buildApp().fetch, port: env.port, hostname: env.host },
  (info) => {
    logger.info({ port: info.port, host: env.host }, 'ai-service listening');
  },
);
