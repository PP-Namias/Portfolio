import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

describe('Security Audit — Rate Limiter', () => {
  let rateLimiter: string
  let middleware: string

  beforeAll(() => {
    rateLimiter = read('src/lib/rate-limiter.ts')
    middleware = read('src/middleware.ts')
  })

  it('rate limiter is imported in middleware', () => {
    expect(middleware).toContain('rate-limiter')
  })

  it('rate limiter exports isGlobalRateLimited function', () => {
    expect(rateLimiter).toContain('isGlobalRateLimited')
  })

  it('rate limiter has Upstash integration', () => {
    expect(rateLimiter).toContain('upstashUrl')
    expect(rateLimiter).toContain('UPSTASH_REDIS_REST_URL')
  })

  it('rate limiter has in-memory fallback', () => {
    expect(rateLimiter).toContain('Map')
    expect(rateLimiter).toContain('memory')
  })

  it('rate limit values are reasonable', () => {
    const maxRequestsMatch = rateLimiter.match(/maxRequests?\s*[=:]\s*(\d+)/)
    const windowMatch = rateLimiter.match(/windowMs?\s*[=:]\s*(\d+)/)
    if (maxRequestsMatch) {
      const max = parseInt(maxRequestsMatch[1])
      expect(max).toBeGreaterThan(0)
      expect(max).toBeLessThan(10000)
    }
    if (windowMatch) {
      const window = parseInt(windowMatch[1])
      expect(window).toBeGreaterThan(0)
    }
  })

  it('rate limiter documents fallback behavior', () => {
    const hasFallbackDocs =
      rateLimiter.includes('memoryRateLimitMap') ||
      rateLimiter.includes('isRateLimitedInMemory') ||
      rateLimiter.includes('isUpstashConfigured')
    expect(hasFallbackDocs).toBe(true)
  })

  it('rate limiter is applied to API routes in middleware', () => {
    expect(middleware).toContain('isGlobalRateLimited')
    expect(middleware).toContain('/api/')
  })
})

describe('Security Audit — Bot Blocker', () => {
  let botBlocker: string

  beforeAll(() => {
    botBlocker = read('src/lib/bot-blocker.ts')
  })

  it('bot blocker exports checkBot function', () => {
    expect(botBlocker).toContain('checkBot')
  })

  it('bot blocker has user-agent patterns', () => {
    expect(botBlocker).toContain('user-agent')
    const uaPatterns = (botBlocker.match(/\/.*\/i/g) || []).length
    expect(uaPatterns).toBeGreaterThan(10)
  })

  it('bot blocker has path patterns', () => {
    expect(botBlocker).toContain('BLOCKED_PATH_PATTERNS')
  })

  it('bot blocker is used in middleware', () => {
    const middleware = read('src/middleware.ts')
    expect(middleware).toContain('bot-blocker')
  })
})

describe('Security Audit — Admin Authentication', () => {
  let admin: string

  beforeAll(() => {
    admin = read('src/lib/admin.ts')
  })

  it('admin module exports isAdminRequest function', () => {
    expect(admin).toContain('isAdminRequest')
  })

  it('uses timing-safe comparison', () => {
    expect(admin).toContain('timingSafeEqual') || expect(admin).toContain('timing-safe')
  })

  it('checks x-api-key header', () => {
    expect(admin).toContain('x-api-key')
  })

  it('does not hardcode API keys', () => {
    const hasHardcodedKey =
      admin.includes('= "sk-') ||
      admin.includes("= 'sk-") ||
      admin.includes('= "api_') ||
      admin.includes("= 'api_")
    expect(hasHardcodedKey).toBe(false)
  })
})
