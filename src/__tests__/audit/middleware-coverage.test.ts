import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

const root = resolve(__dirname, '../../..')
const testsDir = join(root, 'src', '__tests__')

function resolve(...args: string[]) {
  const path = require('path')
  return path.resolve(...args)
}

function getAllTestFiles(): string[] {
  return readdirSync(testsDir, { recursive: true })
    .filter((f: string) => f.endsWith('.test.ts') || f.endsWith('.test.tsx'))
    .map((f: string) => f as string)
}

describe('Test Coverage Audit — Middleware', () => {
  const testFiles = getAllTestFiles()

  it('bot-blocker has dedicated tests', () => {
    const botTests = testFiles.filter((f) => f.includes('bot-block'))
    expect(botTests.length).toBeGreaterThanOrEqual(1)
  })

  it('rate-limiter has dedicated tests', () => {
    const rateTests = testFiles.filter((f) => f.includes('rate-limit'))
    expect(rateTests.length).toBeGreaterThanOrEqual(1)
  })

  it('content-type validation has tests', () => {
    const ctTests = testFiles.filter((f) => f.includes('content-type'))
    expect(ctTests.length).toBeGreaterThanOrEqual(1)
  })

  it('middleware pass-through has tests', () => {
    const ptTests = testFiles.filter((f) => f.includes('pass-through'))
    expect(ptTests.length).toBeGreaterThanOrEqual(1)
  })

  it('middleware integration has tests', () => {
    const mwTests = testFiles.filter((f) => f.includes('middleware'))
    expect(mwTests.length).toBeGreaterThanOrEqual(2)
  })
})

describe('Test Coverage Audit — API Routes', () => {
  const testFiles = getAllTestFiles()

  it('chat API has tests', () => {
    const chatTests = testFiles.filter((f) => f.includes('chat'))
    expect(chatTests.length).toBeGreaterThanOrEqual(1)
  })

  it('CSP violation endpoint has tests', () => {
    const cspTests = testFiles.filter((f) => f.includes('csp'))
    expect(cspTests.length).toBeGreaterThanOrEqual(1)
  })

  it('security headers endpoint has tests', () => {
    const secTests = testFiles.filter((f) => f.includes('security-headers'))
    expect(secTests.length).toBeGreaterThanOrEqual(1)
  })

  it('canary routes have tests', () => {
    const canaryTests = testFiles.filter((f) => f.includes('canary'))
    expect(canaryTests.length).toBeGreaterThanOrEqual(1)
  })

  it('performance cache endpoint has tests', () => {
    const perfTests = testFiles.filter(
      (f) => f.includes('performance-cache') || f.includes('cache-route')
    )
    expect(perfTests.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Test Coverage Audit — Caching', () => {
  const testFiles = getAllTestFiles()

  it('L1 cache has tests', () => {
    const cacheTests = testFiles.filter((f) => f.includes('cache.test'))
    expect(cacheTests.length).toBeGreaterThanOrEqual(1)
  })

  it('Redis cache has tests', () => {
    const redisTests = testFiles.filter((f) => f.includes('redis-cache'))
    expect(redisTests.length).toBeGreaterThanOrEqual(1)
  })

  it('rate limiter upstash has tests', () => {
    const upstashTests = testFiles.filter((f) => f.includes('rate-limiter-upstash'))
    expect(upstashTests.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Test Coverage Audit — Security', () => {
  const testFiles = getAllTestFiles()

  it('admin module has tests', () => {
    const adminTests = testFiles.filter((f) => f.includes('admin.test'))
    expect(adminTests.length).toBeGreaterThanOrEqual(1)
  })

  it('canary module has tests', () => {
    const canaryTests = testFiles.filter(
      (f) => f.includes('canary.test') || f.includes('canary-notify')
    )
    expect(canaryTests.length).toBeGreaterThanOrEqual(1)
  })

  it('media gateway has tests', () => {
    const mediaTests = testFiles.filter((f) => f.includes('media-gateway'))
    expect(mediaTests.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Test Coverage Audit — Audit Tests Themselves', () => {
  const testFiles = getAllTestFiles()

  it('workflow audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/workflow-audit'))).toBe(true)
  })

  it('action pinning audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/action-pinning'))).toBe(true)
  })

  it('workflow crossref audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/workflow-crossref'))).toBe(true)
  })

  it('loop workflow audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/loop-workflow-audit'))).toBe(true)
  })

  it('loop consistency audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/loop-consistency'))).toBe(true)
  })

  it('CSP audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/csp-audit'))).toBe(true)
  })

  it('rate limiter audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/rate-limiter-audit'))).toBe(true)
  })

  it('secret handling audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/secret-handling'))).toBe(true)
  })

  it('cache L1 audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/cache-l1-audit'))).toBe(true)
  })

  it('SWR config audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/swr-config-audit'))).toBe(true)
  })

  it('test inventory audit test exists', () => {
    expect(testFiles.some((f) => f.includes('audit/test-inventory'))).toBe(true)
  })
})
