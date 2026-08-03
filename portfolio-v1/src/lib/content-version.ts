import { redisGetNumber, redisIncr } from '@/lib/redis-cache'

export const CONTENT_VERSION_KEY = 'content-version:v1'
export const CONTENT_VERSION_INITIAL = 0
export const DEFAULT_SANITY_LIVE_POLL_MS = 15_000

let inMemoryVersion = CONTENT_VERSION_INITIAL

export function getSanityLivePollMs(): number {
  const parsed = Number(process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS)
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.round(parsed)
  }
  return DEFAULT_SANITY_LIVE_POLL_MS
}

export async function getContentVersion(): Promise<number> {
  const redisValue = await redisGetNumber(CONTENT_VERSION_KEY)
  if (redisValue !== null) {
    return redisValue
  }
  return inMemoryVersion
}

export async function bumpContentVersion(): Promise<number> {
  const redisValue = await redisIncr(CONTENT_VERSION_KEY)
  if (redisValue !== null) {
    inMemoryVersion = redisValue
    return redisValue
  }
  inMemoryVersion += 1
  return inMemoryVersion
}
