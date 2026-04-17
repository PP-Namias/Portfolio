const memoryRateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const RATE_WINDOW_SECONDS = Math.ceil(RATE_WINDOW_MS / 1000);

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

async function isRateLimitedViaUpstash(ip: string): Promise<boolean> {
  const key = `chat:rate:${ip}`;

  const countRaw = await executeUpstashCommand(['INCR', key]);
  const count = Number(countRaw || 0);

  if (count === 1) {
    await executeUpstashCommand(['EXPIRE', key, RATE_WINDOW_SECONDS]);
  }

  return count > RATE_LIMIT;
}

function isRateLimitedInMemory(ip: string): boolean {
  const now = Date.now();
  const entry = memoryRateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    memoryRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

async function isRateLimited(ip: string): Promise<boolean> {
  if (isUpstashConfigured()) {
    try {
      return await isRateLimitedViaUpstash(ip);
    } catch (error) {
      console.warn(
        '[Chat API] Upstash rate limiter unavailable, falling back to in-memory limiter.',
        error instanceof Error ? error.message : error
      );
      return isRateLimitedInMemory(ip);
    }
  }

  return isRateLimitedInMemory(ip);
}

export { isRateLimited, RATE_LIMIT, RATE_WINDOW_MS };
