interface RateLimiterConfig {
  namespace: string;
  limit: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStores = new Map<string, Map<string, RateLimitEntry>>();
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

function isUpstashConfigured(): boolean {
  return Boolean(upstashUrl && upstashToken);
}

function getMemoryStore(namespace: string): Map<string, RateLimitEntry> {
  if (!memoryStores.has(namespace)) {
    memoryStores.set(namespace, new Map());
  }
  return memoryStores.get(namespace)!;
}

async function executeUpstashCommand(command: Array<string | number>): Promise<unknown> {
  if (!upstashUrl || !upstashToken) {
    throw new Error('Upstash Redis credentials are missing.');
  }
  const response = await fetch(upstashUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Upstash request failed: ${response.status} ${response.statusText}`);
  }
  const payload = (await response.json()) as { result?: unknown; error?: string };
  if (payload.error) {
    throw new Error(`Upstash command error: ${payload.error}`);
  }
  return payload.result;
}

async function checkUpstash(
  namespace: string,
  ip: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const key = `rate:${namespace}:${ip}`;
  const countRaw = await executeUpstashCommand(['INCR', key]);
  const count = Number(countRaw || 0);
  if (count === 1) {
    await executeUpstashCommand(['EXPIRE', key, windowSeconds]);
  }
  return count > limit;
}

function checkMemory(
  namespace: string,
  ip: string,
  limit: number,
  windowMs: number,
): boolean {
  const store = getMemoryStore(namespace);
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

export type { RateLimiterConfig };

export function createRateLimiter(config: RateLimiterConfig) {
  const { namespace, limit, windowMs } = config;
  const windowSeconds = Math.ceil(windowMs / 1000);

  return {
    namespace,
    limit,
    windowMs,
    async isRateLimited(ip: string): Promise<boolean> {
      if (isUpstashConfigured()) {
        try {
          return await checkUpstash(namespace, ip, limit, windowSeconds);
        } catch (error) {
          console.warn(
            `[RateLimiter:${namespace}] Upstash unavailable, falling back to in-memory.`,
            error instanceof Error ? error.message : error,
          );
          return checkMemory(namespace, ip, limit, windowMs);
        }
      }
      return checkMemory(namespace, ip, limit, windowMs);
    },
  };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
