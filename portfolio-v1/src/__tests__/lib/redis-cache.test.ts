import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@upstash/redis', () => {
  const store = new Map<string, unknown>()
  return {
    Redis: vi.fn().mockImplementation(() => ({
      get: vi.fn(async (key: string) => store.get(key) ?? null),
      set: vi.fn(async (key: string, value: unknown) => {
        store.set(key, value)
      }),
      del: vi.fn(async (...keys: string[]) => {
        keys.forEach((k) => store.delete(k))
      }),
      keys: vi.fn(async (pattern: string) => {
        const prefix = pattern.replace('*', '')
        return [...store.keys()].filter((k) => k.startsWith(prefix))
      }),
      smembers: vi.fn(async (key: string) => {
        const val = store.get(key)
        return Array.isArray(val) ? val : []
      }),
      sadd: vi.fn(async (key: string, value: string) => {
        const existing = store.get(key)
        if (Array.isArray(existing)) existing.push(value)
        else store.set(key, [value])
      }),
      ping: vi.fn(async () => 'PONG'),
      pipeline: vi.fn(() => ({
        get: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        del: vi.fn().mockReturnThis(),
        exec: vi.fn(async () => []),
      })),
    })),
  }
})

import { redisGet, redisSet, redisInvalidateByTag, redisFlush, redisStats } from '@/lib/redis-cache'

describe('redis-cache', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('redisGet returns null when no connection', async () => {
    const result = await redisGet('nonexistent-key')
    expect(result).toBeNull()
  })

  it('redisSet returns early when no connection', async () => {
    await expect(redisSet('key', 'value')).resolves.toBeUndefined()
  })

  it('redisSet with tags returns early', async () => {
    await expect(
      redisSet('key', 'data', { tags: ['tag1'], ttlMs: 5000, staleMs: 1000 })
    ).resolves.toBeUndefined()
  })

  it('redisInvalidateByTag returns 0 when no connection', async () => {
    const count = await redisInvalidateByTag('nonexistent-tag')
    expect(count).toBe(0)
  })

  it('redisFlush returns 0 when no connection', async () => {
    const count = await redisFlush()
    expect(count).toBe(0)
  })

  it('redisStats returns disconnected state', async () => {
    const stats = await redisStats()
    expect(stats).toEqual({ size: 0, redisConnected: false })
  })
})
