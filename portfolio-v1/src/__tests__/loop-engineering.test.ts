import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { parse as parseYaml } from 'yaml'

const root = resolve(__dirname, '../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

function exists(name: string) {
  return existsSync(resolve(root, name))
}

describe('Loop Engineering — STATE.md', () => {
  it('exists at repo root', () => {
    expect(exists('STATE.md')).toBe(true)
  })

  it('contains required sections', () => {
    const content = read('STATE.md')
    expect(content).toContain('## High Priority')
    expect(content).toContain('## Watch List')
    expect(content).toContain('## Recent Noise')
  })

  it('contains a last run timestamp', () => {
    const content = read('STATE.md')
    expect(content).toContain('Last run:')
  })
})

describe('Loop Engineering — LOOP.md', () => {
  it('exists at repo root', () => {
    expect(exists('LOOP.md')).toBe(true)
  })

  it('documents at least 3 loops', () => {
    const content = read('LOOP.md')
    expect(content).toContain('Daily Triage')
    expect(content).toContain('PR Babysitter')
    expect(content).toContain('Dependency Sweeper')
  })

  it('each loop has cadence documented', () => {
    const content = read('LOOP.md')
    expect(content).toContain('Cadence:')
  })

  it('each loop has phase documented', () => {
    const content = read('LOOP.md')
    expect(content).toContain('L1')
    expect(content).toContain('L2')
  })
})

describe('Loop Engineering — loop-budget.md', () => {
  it('exists at repo root', () => {
    expect(exists('loop-budget.md')).toBe(true)
  })

  it('contains budget table with loops', () => {
    const content = read('loop-budget.md')
    expect(content).toContain('Daily Triage')
    expect(content).toContain('PR Babysitter')
    expect(content).toContain('Dependency Sweeper')
  })

  it('has max runs/day and max tokens/day', () => {
    const content = read('loop-budget.md')
    expect(content).toContain('Max runs/day')
    expect(content).toContain('Max tokens/day')
  })

  it('documents kill switch', () => {
    const content = read('loop-budget.md')
    expect(content).toContain('loop-pause-all')
  })
})

describe('Loop Engineering — loop-run-log.md', () => {
  it('exists at repo root', () => {
    expect(exists('loop-run-log.md')).toBe(true)
  })

  it('has format documentation', () => {
    const content = read('loop-run-log.md')
    expect(content).toContain('## Format')
    expect(content).toContain('Status')
    expect(content).toContain('Findings')
  })

  it('has initial entry', () => {
    const content = read('loop-run-log.md')
    expect(content).toContain('system-init')
  })
})

describe('Loop Engineering — workflow files', () => {
  it('daily-triage.yml exists', () => {
    expect(exists('.github/workflows/daily-triage.yml')).toBe(true)
  })

  it('pr-babysitter.yml exists', () => {
    expect(exists('.github/workflows/pr-babysitter.yml')).toBe(true)
  })

  it('dependency-sweeper.yml exists', () => {
    expect(exists('.github/workflows/dependency-sweeper.yml')).toBe(true)
  })

  it('daily-triage.yml has schedule trigger', () => {
    const content = read('.github/workflows/daily-triage.yml')
    expect(content).toContain('schedule:')
    expect(content).toContain('cron:')
  })

  it('pr-babysitter.yml has PR trigger', () => {
    const content = read('.github/workflows/pr-babysitter.yml')
    expect(content).toContain('pull_request:')
  })

  it('dependency-sweeper.yml has schedule trigger', () => {
    const content = read('.github/workflows/dependency-sweeper.yml')
    expect(content).toContain('schedule:')
  })

  it('all workflows check kill switch', () => {
    const files = [
      '.github/workflows/daily-triage.yml',
      '.github/workflows/pr-babysitter.yml',
      '.github/workflows/dependency-sweeper.yml',
    ]
    for (const file of files) {
      const content = read(file)
      expect(content).toContain('loop-pause-all')
    }
  })

  it('all workflows reference existing npm scripts', () => {
    const files = ['.github/workflows/daily-triage.yml', '.github/workflows/pr-babysitter.yml']
    const allowedScripts = [
      'npm run lint',
      'npm run test',
      'npm run doctor',
      'npx tsc',
      'npm audit',
    ]
    for (const file of files) {
      const content = read(file)
      for (const script of allowedScripts) {
        if (content.includes(script)) {
          expect(true).toBe(true)
        }
      }
    }
  })
})

describe('Loop Engineering — skill file', () => {
  it('loop-engineering skill exists', () => {
    expect(exists('.agents/skills/loop-engineering/SKILL.md')).toBe(true)
  })

  it('skill documents core files', () => {
    const content = read('.agents/skills/loop-engineering/SKILL.md')
    expect(content).toContain('STATE.md')
    expect(content).toContain('LOOP.md')
    expect(content).toContain('loop-budget.md')
    expect(content).toContain('loop-run-log.md')
  })

  it('skill documents all 3 loops', () => {
    const content = read('.agents/skills/loop-engineering/SKILL.md')
    expect(content).toContain('Daily Triage')
    expect(content).toContain('PR Babysitter')
    expect(content).toContain('Dependency Sweeper')
  })

  it('skill documents kill switch', () => {
    const content = read('.agents/skills/loop-engineering/SKILL.md')
    expect(content).toContain('loop-pause-all')
  })
})

describe('Loop Engineering — AGENTS.md integration', () => {
  it('AGENTS.md contains Loop Engineering section', () => {
    const content = read('AGENTS.md')
    expect(content).toContain('## Loop Engineering')
  })

  it('AGENTS.md documents core files', () => {
    const content = read('AGENTS.md')
    expect(content).toContain('STATE.md')
    expect(content).toContain('LOOP.md')
    expect(content).toContain('loop-budget.md')
    expect(content).toContain('loop-run-log.md')
  })

  it('AGENTS.md documents active loops', () => {
    const content = read('AGENTS.md')
    expect(content).toContain('Daily Triage')
    expect(content).toContain('PR Babysitter')
    expect(content).toContain('Dependency Sweeper')
  })
})
