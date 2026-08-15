import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

import { runRag } from '../graph/build-graph';
import type { ChatHistoryItem } from '../graph/types';
import { logger } from '../lib/logger';
import { rateLimit } from '../lib/rate-limit';
import { createThreadStore } from '../lib/thread-store';

export const chatBodySchema = z.object({
  message: z.string().trim().min(1).max(4000),
  threadId: z.string().min(1).max(100).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .max(20)
    .optional(),
});

export type ChatBody = z.infer<typeof chatBodySchema>;

function splitTokens(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [text];
}

export function buildChatRoute() {
  const app = new Hono();
  const store = createThreadStore();

  app.use('*', rateLimit({ max: 30, windowMs: 60_000 }));

  app.post(
    '/chat',
    zValidator('json', chatBodySchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Invalid chat request', issues: result.error.issues }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid('json') as ChatBody;
      const threadId = body.threadId ?? null;
      let history: ChatHistoryItem[] = body.history ?? [];

      if (threadId) {
        const thread = await store.get(threadId);
        if (!thread) {
          return c.json({ error: 'Thread not found' }, 404);
        }
        history = thread.messages.slice(-8).map((message) => ({
          role: message.role,
          content: message.content,
        }));
      }

      const wantSse = (c.req.header('accept') ?? '').includes('text/event-stream');

      if (!wantSse) {
        try {
          const result = await runRag(body.message, history);
          const resolvedThreadId = await persistExchange(store, threadId, body.message, result);
          return c.json({ ...result, threadId: resolvedThreadId });
        } catch (error) {
          logger.error({ err: String(error) }, 'chat JSON mode failed');
          return c.json({ error: 'Failed to generate a response' }, 502);
        }
      }

      return streamSSE(c, async (stream) => {
        await stream.writeSSE({ event: 'status', data: 'thinking' });
        try {
          const result = await runRag(body.message, history);
          const resolvedThreadId = await persistExchange(store, threadId, body.message, result);
          await stream.writeSSE({ event: 'status', data: 'answering' });
          for (const token of splitTokens(result.response)) {
            await stream.writeSSE({ event: 'token', data: token });
          }
          await stream.writeSSE({
            event: 'done',
            data: JSON.stringify({
              response: result.response,
              citations: result.citations,
              intent: result.intent,
              usedContext: result.usedContext,
              latencyMs: result.latencyMs,
              threadId: resolvedThreadId,
            }),
          });
        } catch (error) {
          logger.error({ err: String(error) }, 'chat SSE mode failed');
          await stream.writeSSE({ event: 'error', data: JSON.stringify({ message: 'Failed to generate a response' }) });
        }
      });
    },
  );

  return app;
}

async function persistExchange(
  store: ReturnType<typeof createThreadStore>,
  threadId: string | null,
  message: string,
  result: Awaited<ReturnType<typeof runRag>>,
): Promise<string> {
  const targetId = threadId ?? (await store.create()).id;
  await store.appendMessage(targetId, { role: 'user', content: message });
  await store.appendMessage(targetId, { role: 'assistant', content: result.response, citations: result.citations });
  return targetId;
}
