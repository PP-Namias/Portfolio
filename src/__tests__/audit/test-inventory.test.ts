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

function countTests(content: string): number {
  const itBlocks = content.match(/\bit\(/g) || []
  const describeBlocks = content.match(/\bdescribe\(/g) || []
  return itBlocks.length
}

describe('Test Coverage Audit — Inventory', () => {
  const testFiles = getAllTestFiles()
  const totalTests = testFiles.reduce((sum, file) => {
    const content = readFileSync(join(testsDir, file), 'utf8')
    return sum + countTests(content)
  }, 0)

  it('has at least 70 test files', () => {
    expect(testFiles.length).toBeGreaterThanOrEqual(70)
  })

  it('has at least 500 test cases', () => {
    expect(totalTests).toBeGreaterThanOrEqual(500)
  })

  it('audit test files exist', () => {
    const auditFiles = testFiles.filter((f) => f.startsWith('audit/'))
    expect(auditFiles.length).toBeGreaterThanOrEqual(5)
  })

  it('no test files are empty', () => {
    for (const file of testFiles) {
      const content = readFileSync(join(testsDir, file), 'utf8')
      expect(content.length).toBeGreaterThan(100)
    }
  })

  it('all test files have at least one describe block', () => {
    for (const file of testFiles) {
      const content = readFileSync(join(testsDir, file), 'utf8')
      expect(content).toContain('describe(')
    }
  })

  it('all test files have at least one test case', () => {
    for (const file of testFiles) {
      const content = readFileSync(join(testsDir, file), 'utf8')
      expect(content).toContain('it(')
    }
  })

  it('summary of test coverage by category', () => {
    const categories: Record<string, number> = {}
    for (const file of testFiles) {
      const parts = file.split('/')
      const category = parts.length > 1 ? parts[0] : 'root'
      categories[category] = (categories[category] || 0) + 1
    }
    console.log('\nTest files by category:')
    for (const [cat, count] of Object.entries(categories).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${cat}: ${count} files`)
    }
    expect(true).toBe(true)
  })
})

describe('Test Coverage Audit — Critical Paths', () => {
  it('middleware has test coverage', () => {
    const testFiles = getAllTestFiles()
    const middlewareTests = testFiles.filter(
      (f) =>
        f.includes('middleware') ||
        f.includes('bot-block') ||
        f.includes('rate-limit') ||
        f.includes('content-type')
    )
    expect(middlewareTests.length).toBeGreaterThanOrEqual(3)
  })

  it('API routes have test coverage', () => {
    const testFiles = getAllTestFiles()
    const apiTests = testFiles.filter(
      (f) => f.includes('api') || f.includes('chat') || f.includes('canary') || f.includes('csp')
    )
    expect(apiTests.length).toBeGreaterThanOrEqual(5)
  })

  it('caching has test coverage', () => {
    const testFiles = getAllTestFiles()
    const cacheTests = testFiles.filter((f) => f.includes('cache') || f.includes('redis'))
    expect(cacheTests.length).toBeGreaterThanOrEqual(3)
  })

  it('security has test coverage', () => {
    const testFiles = getAllTestFiles()
    const securityTests = testFiles.filter(
      (f) => f.includes('security') || f.includes('canary') || f.includes('admin')
    )
    expect(securityTests.length).toBeGreaterThanOrEqual(3)
  })

  it('components have test coverage', () => {
    const testFiles = getAllTestFiles()
    const componentTests = testFiles.filter(
      (f) => f.includes('components') || f.includes('.test.tsx')
    )
    expect(componentTests.length).toBeGreaterThanOrEqual(15)
  })

  it('lib modules have test coverage', () => {
    const testFiles = getAllTestFiles()
    const libTests = testFiles.filter((f) => f.includes('lib/'))
    expect(libTests.length).toBeGreaterThanOrEqual(8)
  })
})

describe('Test Coverage Audit — Vitest Config', () => {
  it('vitest config exists', () => {
    const exists = require('fs').existsSync(resolve(root, 'vitest.config.ts'))
    expect(exists).toBe(true)
  })

  it('has reasonable coverage thresholds', () => {
    const config = readFileSync(resolve(root, 'vitest.config.ts'), 'utf8')
    expect(config).toContain('statements')
    expect(config).toContain('branches')
    expect(config).toContain('functions')
    expect(config).toContain('lines')
  })

  it('excludes test files from coverage', () => {
    const config = readFileSync(resolve(root, 'vitest.config.ts'), 'utf8')
    expect(config).toContain('src/__tests__/**')
  })

  it('uses jsdom environment', () => {
    const config = readFileSync(resolve(root, 'vitest.config.ts'), 'utf8')
    expect(config).toContain('jsdom')
  })
})
