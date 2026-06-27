const memoryRateLimitMap = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_LIMIT = 30;
const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_WINDOW_SECONDS = Math.ceil(DEFAULT_WINDOW_MS / 1000);

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

function isUpstashConfigured(): boolean {
  return Boolean(upstashUrl && upstashToken);
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

async function isRateLimitedViaUpstash(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const countRaw = await executeUpstashCommand(['INCR', key]);
  const count = Number(countRaw || 0);

  if (count === 1) {
    await executeUpstashCommand(['EXPIRE', key, windowSeconds]);
  }

  return count > limit;
}

function isRateLimitedInMemory(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryRateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    memoryRateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

export async function isGlobalRateLimited(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS
): Promise<boolean> {
  const windowSeconds = Math.ceil(windowMs / 1000);
  const key = `rl:${ip}`;

  if (isUpstashConfigured()) {
    try {
      return await isRateLimitedViaUpstash(key, limit, windowSeconds);
    } catch {
      return isRateLimitedInMemory(key, limit, windowMs);
    }
  }

  return isRateLimitedInMemory(key, limit, windowMs);
}
