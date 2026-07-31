import { createMiddleware } from 'hono/factory';

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export function rateLimit(options: RateLimitOptions) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return createMiddleware(async (c, next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();

    let bucket = buckets.get(ip);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + options.windowMs };
      buckets.set(ip, bucket);
    }
    bucket.count += 1;

    if (bucket.count > options.max) {
      return c.json({ error: 'Too many requests, please slow down.' }, 429);
    }

    await next();
  });
}
