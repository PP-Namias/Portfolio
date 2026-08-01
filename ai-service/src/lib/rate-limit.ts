import { createMiddleware } from 'hono/factory';

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

const MAX_BUCKETS = 10_000;
const SWEEP_EVERY_MS = 60_000;

function isProxyTrusted(): boolean {
  const value = (process.env.AI_SERVICE_TRUST_PROXY ?? '0').toLowerCase();
  return value === '1' || value === 'true';
}

export function rateLimit(options: RateLimitOptions) {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  let lastSweepAt = 0;

  return createMiddleware(async (c, next) => {
    const now = Date.now();

    if (now - lastSweepAt >= SWEEP_EVERY_MS) {
      lastSweepAt = now;
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) {
          buckets.delete(key);
        }
      }
    }

    const ip = isProxyTrusted()
      ? (c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'unknown')
      : (c.req.header('x-real-ip') ?? 'local');

    let bucket = buckets.get(ip);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + options.windowMs };
      buckets.set(ip, bucket);
    }
    bucket.count += 1;

    if (bucket.count > options.max) {
      return c.json({ error: 'Too many requests, please slow down.' }, 429);
    }

    if (buckets.size > MAX_BUCKETS) {
      for (const key of buckets.keys()) {
        buckets.delete(key);
        if (buckets.size <= MAX_BUCKETS) {
          break;
        }
      }
    }

    await next();
  });
}
