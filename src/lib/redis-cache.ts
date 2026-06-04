import { Redis } from '@upstash/redis'

interface RedisCacheEntry<T> {
  data: T
  expiresAt: number
  staleAt: number
  tags: string[]
}

const REDIS_URL = process.env.REDIS_CACHE_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const REDIS_TOKEN = process.env.REDIS_CACHE_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis
  if (!REDIS_URL || !REDIS_TOKEN) return null
  try {
    redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    return redis
  } catch {
    return null
  }
}

const DEFAULT_TTL_MS = 300_000
const DEFAULT_STALE_MS = 60_000

function redisKey(cacheKey: string): string {
  return `cache:v1:${cacheKey}`
}

function tagSetKey(tag: string): string {
  return `cache:v1:tag:${tag}`
}

function isExpired(entry: RedisCacheEntry<unknown>): boolean {
  return Date.now() > entry.expiresAt
}

function isStale(entry: RedisCacheEntry<unknown>): boolean {
  return Date.now() > entry.staleAt
}

export async function redisGet<T>(key: string): Promise<{ data: T; stale: boolean } | null> {
  const r = getRedis()
  if (!r) return null
  try {
    const entry = await r.get<RedisCacheEntry<T>>(redisKey(key))
    if (!entry) return null
    if (isExpired(entry)) {
      await r.del(redisKey(key))
      return null
    }
    return { data: entry.data, stale: isStale(entry) }
  } catch {
    return null
  }
}

export async function redisSet<T>(key: string, data: T, options?: { ttlMs?: number; staleMs?: number; tags?: string[] }): Promise<void> {
  const r = getRedis()
  if (!r) return
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS
  const staleMs = options?.staleMs ?? DEFAULT_STALE_MS
  const now = Date.now()
  const tags = options?.tags ?? []
  const entry: RedisCacheEntry<T> = {
    data,
    expiresAt: now + ttlMs,
    staleAt: now + Math.min(staleMs, ttlMs),
    tags,
  }
  try {
    const rk = redisKey(key)
    await r.set(rk, entry, { px: ttlMs })
    for (const tag of tags) {
      await r.sadd(tagSetKey(tag), rk)
    }
  } catch {
    // Redis unavailable — silently skip
  }
}

export async function redisInvalidateByTag(tag: string): Promise<number> {
  const r = getRedis()
  if (!r) return 0
  try {
    const tsk = tagSetKey(tag)
    const members = await r.smembers<string[]>(tsk)
    if (members.length > 0) {
      await r.del(...members)
    }
    await r.del(tsk)
    return members.length
  } catch {
    return 0
  }
}

export async function redisFlush(): Promise<number> {
  const r = getRedis()
  if (!r) return 0
  try {
    const keys = await r.keys('cache:v1:*')
    if (keys.length === 0) return 0
    await r.del(...keys)
    return keys.length
  } catch {
    return 0
  }
}

export async function redisStats(): Promise<{ size: number; redisConnected: boolean }> {
  const r = getRedis()
  if (!r) return { size: 0, redisConnected: false }
  try {
    await r.ping()
    const keys = await r.keys('cache:v1:*')
    return { size: keys.length, redisConnected: true }
  } catch {
    return { size: 0, redisConnected: false }
  }
}
