import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { rateLimit } from '../lib/rate-limit';
import { createThreadStore } from '../lib/thread-store';

const createThreadSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

const updateThreadSchema = z.object({
  title: z.string().min(1).max(200),
});

export function buildThreadsRoute() {
  const app = new Hono();
  const store = createThreadStore();

  app.use('*', rateLimit({ max: 60, windowMs: 60_000 }));

  app.get('/threads', async (c) => {
    const threads = await store.list();
    return c.json({ threads });
  });

  app.post(
    '/threads',
    zValidator('json', createThreadSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Invalid thread payload', issues: result.error.issues }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid('json') as z.infer<typeof createThreadSchema>;
      const thread = await store.create(body.title);
      return c.json({ thread }, 201);
    },
  );

  app.get('/threads/:id', async (c) => {
    const thread = await store.get(c.req.param('id'));
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    return c.json({ thread });
  });

  app.patch(
    '/threads/:id',
    zValidator('json', updateThreadSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Invalid thread payload', issues: result.error.issues }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid('json') as z.infer<typeof updateThreadSchema>;
      const thread = await store.update(c.req.param('id'), { title: body.title });
      if (!thread) {
        return c.json({ error: 'Thread not found' }, 404);
      }
      return c.json({ thread });
    },
  );

  app.delete('/threads/:id', async (c) => {
    const removed = await store.remove(c.req.param('id'));
    if (!removed) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    return c.body(null, 204);
  });

  return app;
}
