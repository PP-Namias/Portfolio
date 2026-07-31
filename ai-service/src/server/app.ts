import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { getEnv, isVectorStoreConfigured } from '../config/env';
import { ProviderUnavailableError, RagError } from '../lib/errors';
import { logger } from '../lib/logger';
import { buildAdminRoute } from '../routes/admin';
import { buildChatRoute } from '../routes/chat';
import { buildThreadsRoute } from '../routes/threads';
import { getIndexStats } from '../vector/indexer';

function readVersion(): string {
  try {
    const raw = readFileSync(join(process.cwd(), 'package.json'), 'utf8');
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function buildApp() {
  const env = getEnv();
  const app = new Hono();

  app.use('*', cors({ origin: env.corsOrigins.length > 0 ? env.corsOrigins : '*', allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowHeaders: ['content-type', 'accept', 'x-reindex-secret'] }));

  app.use('*', async (c, next) => {
    const startedAt = Date.now();
    await next();
    logger.info({ method: c.req.method, path: c.req.path, status: c.res.status, ms: Date.now() - startedAt }, 'request');
  });

  app.get('/api/health', (c) => {
    return c.json({
      status: 'ok',
      version: readVersion(),
      uptimeSeconds: Math.round(process.uptime()),
      vectorStoreConfigured: isVectorStoreConfigured(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/stats', async (c) => {
    const stats = await getIndexStats();
    return c.json({ ...stats, timestamp: new Date().toISOString() });
  });

  app.route('/api', buildChatRoute());
  app.route('/api/chat', buildThreadsRoute());
  app.route('/api/admin', buildAdminRoute());

  app.notFound((c) => c.json({ error: 'Not found' }, 404));

  app.onError((error, c) => {
    if (error instanceof ProviderUnavailableError) {
      logger.error({ code: error.code }, error.message);
      return c.json({ error: error.message }, 503);
    }
    if (error instanceof RagError) {
      logger.error({ code: error.code }, error.message);
      return c.json({ error: error.message }, 502);
    }
    logger.error({ err: String(error) }, 'unhandled error');
    return c.json({ error: 'Internal server error' }, 500);
  });

  return app;
}
