import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { IS_UPSTASH_RATE_LIMIT_ENABLED } from '@/lib/features'

const memoryRateLimitMap = new Map<string, { count: number; resetAt: number }>()

const DEFAULT_LIMIT = 30
const DEFAULT_WINDOW_MS = 60_000

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

let ratelimit: Ratelimit | null = null

if (IS_UPSTASH_RATE_LIMIT_ENABLED && upstashUrl && upstashToken) {
  const redis = new Redis({
    url: upstashUrl,
    token: upstashToken,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(DEFAULT_LIMIT, `${Math.ceil(DEFAULT_WINDOW_MS / 1000)}s`),
    analytics: true,
  })
}

function isRateLimitedInMemory(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = memoryRateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    memoryRateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  return entry.count > limit
}

export async function isGlobalRateLimited(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS
): Promise<boolean> {
  const key = `rl:${ip}`

  if (ratelimit) {
    try {
      const result = await ratelimit.limit(key)
      return !result.success
    } catch {
      return isRateLimitedInMemory(key, limit, windowMs)
    }
  }

  return isRateLimitedInMemory(key, limit, windowMs)
}
