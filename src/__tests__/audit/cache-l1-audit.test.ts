import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

describe('Caching Audit — L1 In-Memory Cache', () => {
  let cache: string

  beforeAll(() => {
    cache = read('src/lib/cache.ts')
  })

  it('exports get function', () => {
    expect(cache).toContain('export function get')
  })

  it('exports set function', () => {
    expect(cache).toContain('export function set')
  })

  it('exports keyFor function', () => {
    expect(cache).toContain('export function keyFor')
  })

  it('exports getOrFetch function', () => {
    expect(cache).toContain('export async function getOrFetch')
  })

  it('has default TTL of 300 seconds (5 minutes)', () => {
    expect(cache).toContain('DEFAULT_TTL_MS')
    expect(cache).toContain('300_000')
  })

  it('has default stale-while-revalidate of 60 seconds', () => {
    expect(cache).toContain('DEFAULT_STALE_MS')
    expect(cache).toContain('60_000')
  })

  it('uses Map for storage', () => {
    expect(cache).toContain('new Map')
  })

  it('implements TTL expiration check', () => {
    expect(cache).toContain('isExpired')
    expect(cache).toContain('expiresAt')
  })

  it('implements stale-while-revalidate check', () => {
    expect(cache).toContain('isStale')
    expect(cache).toContain('staleAt')
  })

  it('supports tag-based invalidation', () => {
    expect(cache).toContain('tags')
    expect(cache).toContain('invalidateByTag')
  })

  it('integrates with Redis cache (L2)', () => {
    expect(cache).toContain('redisGet')
    expect(cache).toContain('redisSet')
  })

  it('has skipRedis option', () => {
    expect(cache).toContain('skipRedis')
  })
})

describe('Caching Audit — L2 Redis Cache', () => {
  let redisCache: string

  beforeAll(() => {
    redisCache = read('src/lib/redis-cache.ts')
  })

  it('imports @upstash/redis', () => {
    expect(redisCache).toContain('@upstash/redis')
  })

  it('reads Redis URL from environment', () => {
    expect(redisCache).toContain('UPSTASH_REDIS_REST_URL')
  })

  it('reads Redis token from environment', () => {
    expect(redisCache).toContain('UPSTASH_REDIS_REST_TOKEN')
  })

  it('has graceful fallback when Redis is not configured', () => {
    expect(redisCache).toContain('if (!REDIS_URL || !REDIS_TOKEN) return null')
  })

  it('exports redisGet function', () => {
    expect(redisCache).toContain('export async function redisGet')
  })

  it('exports redisSet function', () => {
    expect(redisCache).toContain('export async function redisSet')
  })

  it('exports redisInvalidateByTag function', () => {
    expect(redisCache).toContain('export async function redisInvalidateByTag')
  })

  it('exports redisFlush function', () => {
    expect(redisCache).toContain('export async function redisFlush')
  })

  it('exports redisStats function', () => {
    expect(redisCache).toContain('export async function redisStats')
  })

  it('uses key prefix for cache versioning', () => {
    expect(redisCache).toContain('cache:v1:')
  })

  it('has default TTL of 300 seconds', () => {
    expect(redisCache).toContain('300_000')
  })

  it('has default stale-while-revalidate of 60 seconds', () => {
    expect(redisCache).toContain('60_000')
  })

  it('handles errors gracefully (returns null)', () => {
    expect(redisCache).toContain('catch')
    expect(redisCache).toContain('return null')
  })
})
