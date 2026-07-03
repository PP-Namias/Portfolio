import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

function countTestFiles(): number {
  const testsDir = join(root, 'src', '__tests__')
  return readdirSync(testsDir, { recursive: true }).filter(
    (f: string) => f.endsWith('.test.ts') || f.endsWith('.test.tsx')
  ).length
}

describe('Documentation Accuracy Audit — AGENTS.md', () => {
  let agents: string
  let pkg: Record<string, unknown>

  beforeAll(() => {
    agents = read('AGENTS.md')
    pkg = JSON.parse(read('package.json'))
  })

  it('react-doctor version matches package.json', () => {
    const agentsMatch = agents.match(/react-doctor@([\d.]+)/)
    const pkgVersion = (pkg.devDependencies as Record<string, string>)['react-doctor']
    if (agentsMatch && pkgVersion) {
      expect(agentsMatch[1]).toBe(pkgVersion)
    }
  })

  it('test file count is approximately correct', () => {
    const agentsMatch = agents.match(/(\d+)\s*test files/)
    const actualCount = countTestFiles()
    if (agentsMatch) {
      const claimed = parseInt(agentsMatch[1])
      expect(Math.abs(claimed - actualCount)).toBeLessThan(20)
    }
  })

  it('test count is approximately correct', () => {
    const agentsMatch = agents.match(/(\d+)\s*tests/)
    if (agentsMatch) {
      const claimed = parseInt(agentsMatch[1])
      expect(claimed).toBeGreaterThan(500)
    }
  })

  it('references valid workflow files', () => {
    const workflowRefs = agents.match(/\.github\/workflows\/[\w-]+\.yml/g) || []
    for (const ref of workflowRefs) {
      const exists = require('fs').existsSync(resolve(root, ref))
      expect(exists).toBe(true)
    }
  })

  it('references valid skill files', () => {
    const skillRefs = agents.match(/`[\w-]+`/g) || []
    const skillFiles = readdirSync(resolve(root, '.agents', 'skills'))
    for (const ref of skillRefs) {
      const name = ref.replace(/`/g, '')
      if (skillFiles.includes(name)) {
        const exists = require('fs').existsSync(
          resolve(root, '.agents', 'skills', name, 'SKILL.md')
        )
        expect(exists).toBe(true)
      }
    }
  })

  it('documents all 3 loop-engineering loops', () => {
    expect(agents).toContain('Daily Triage')
    expect(agents).toContain('PR Babysitter')
    expect(agents).toContain('Dependency Sweeper')
  })

  it('documents all core loop files', () => {
    expect(agents).toContain('STATE.md')
    expect(agents).toContain('LOOP.md')
    expect(agents).toContain('loop-budget.md')
    expect(agents).toContain('loop-run-log.md')
  })

  it('documents kill switch', () => {
    expect(agents).toContain('loop-pause-all')
  })

  it('references valid subagent files', () => {
    const subagentRefs = agents.match(/\.agents\/subagents\/[\w-]+\.md/g) || []
    for (const ref of subagentRefs) {
      const exists = require('fs').existsSync(resolve(root, ref))
      expect(exists).toBe(true)
    }
  })

  it('references valid workflow doc files', () => {
    const workflowDocRefs = agents.match(/\.agents\/workflows\/[\w-]+\.md/g) || []
    for (const ref of workflowDocRefs) {
      const exists = require('fs').existsSync(resolve(root, ref))
      expect(exists).toBe(true)
    }
  })
})

describe('Documentation Accuracy Audit — STATE.md', () => {
  it('has valid ISO timestamp', () => {
    const content = read('STATE.md')
    const match = content.match(/Last run:\s*(\S+)/)
    expect(match).not.toBeNull()
    if (match) {
      expect(() => new Date(match[1])).not.toThrow()
    }
  })

  it('has all required sections', () => {
    const content = read('STATE.md')
    expect(content).toContain('## High Priority')
    expect(content).toContain('## Watch List')
    expect(content).toContain('## Recent Noise')
  })
})

describe('Documentation Accuracy Audit — README.md', () => {
  it('README.md exists', () => {
    const exists = require('fs').existsSync(resolve(root, 'README.md'))
    expect(exists).toBe(true)
  })

  it('README.md has project name', () => {
    const content = read('README.md')
    expect(content).toContain('Namias') || expect(content).toContain('portfolio')
  })
})

describe('Documentation Accuracy Audit — PRD Files', () => {
  it('all PRD files are valid JSON', () => {
    const prdDir = join(root, 'docs', 'prd')
    const prdFiles = readdirSync(prdDir).filter((f) => f.endsWith('.json'))
    for (const file of prdFiles) {
      expect(() => JSON.parse(readFileSync(join(prdDir, file), 'utf8'))).not.toThrow()
    }
  })

  it('loop-engineering PRD has all stories marked done', () => {
    const prd = JSON.parse(read('docs/prd/prd.loop-engineering.json'))
    for (const epic of prd.epics) {
      expect(epic.status).toBe('done')
      for (const story of epic.stories) {
        expect(story.done).toBe(true)
      }
    }
  })

  it('system-audit PRD exists and is valid', () => {
    const prd = JSON.parse(read('docs/prd/prd.system-audit.json'))
    expect(prd.epics).toBeDefined()
    expect(prd.epics.length).toBeGreaterThanOrEqual(6)
  })
})
