import { timingSafeEqual } from 'node:crypto';

import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { getEnv } from '../config/env';
import { logger } from '../lib/logger';
import { rateLimit } from '../lib/rate-limit';
import { getIndexStats, incrementalIndex, reindexAll } from '../vector/indexer';

const reindexSchema = z.object({
  mode: z.enum(['full', 'incremental']).default('incremental'),
  dryRun: z.boolean().default(false),
  reset: z.boolean().default(false),
});

function secretMatches(provided: string, expected: string): boolean {
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  return providedBuf.length === expectedBuf.length && timingSafeEqual(providedBuf, expectedBuf);
}

export function buildAdminRoute() {
  const app = new Hono();

  app.use('*', rateLimit({ max: 10, windowMs: 60_000 }));
  app.use(async (c, next) => {
    const env = getEnv();
    if (!env.reindexSecret) {
      return c.json({ error: 'Reindex secret not configured on the server' }, 503);
    }
    const provided = c.req.header('x-reindex-secret');
    if (!provided || !secretMatches(provided, env.reindexSecret)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    await next();
  });

  app.post(
    '/reindex',
    zValidator('json', reindexSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Invalid reindex payload', issues: result.error.issues }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid('json') as z.infer<typeof reindexSchema>;
      logger.info({ mode: body.mode, dryRun: body.dryRun }, 'admin reindex requested');
      const result =
        body.mode === 'full'
          ? await reindexAll({ dryRun: body.dryRun, reset: body.reset })
          : await incrementalIndex({ dryRun: body.dryRun });
      return c.json({ ok: true, result });
    },
  );

  app.get('/stats', async (c) => {
    const stats = await getIndexStats();
    return c.json(stats);
  });

  return app;
}
