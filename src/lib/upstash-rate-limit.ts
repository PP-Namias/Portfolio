import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

let ratelimit: Ratelimit | null = null

if (redisUrl && redisToken) {
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10s'),
    analytics: true,
  })
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  window: string = '10s'
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!ratelimit) {
    return { success: true, remaining: limit, reset: Date.now() + 10000 }
  }

  const result = await ratelimit.limit(identifier)
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  }
}

export { ratelimit }
