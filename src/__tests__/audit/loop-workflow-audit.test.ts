import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parse as parseYaml } from 'yaml'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

function readWorkflow(name: string) {
  return readFileSync(resolve(root, '.github', 'workflows', name), 'utf8')
}

function parseWorkflow(name: string) {
  return parseYaml(readWorkflow(name))
}

describe('Loop Engineering — Behavior Audit', () => {
  describe('STATE.md content quality', () => {
    it('does not contain placeholder text from initial scaffold', () => {
      const content = read('STATE.md')
      expect(content).not.toContain(
        'No active loops yet. Loops will be wired in EPIC-1 through EPIC-3'
      )
    })

    it('contains actual loop references', () => {
      const content = read('STATE.md')
      const hasLoopRef =
        content.toLowerCase().includes('daily-triage') ||
        content.toLowerCase().includes('pr-babysitter') ||
        content.toLowerCase().includes('dependency-sweeper') ||
        content.toLowerCase().includes('all checks passing')
      expect(hasLoopRef).toBe(true)
    })

    it('has a valid ISO timestamp in Last run', () => {
      const content = read('STATE.md')
      const match = content.match(/Last run:\s*(\S+)/)
      expect(match).not.toBeNull()
      if (match) {
        expect(() => new Date(match[1])).not.toThrow()
        expect(new Date(match[1]).getTime()).not.toBeNaN()
      }
    })

    it('has all required sections', () => {
      const content = read('STATE.md')
      expect(content).toContain('## High Priority')
      expect(content).toContain('## Watch List')
      expect(content).toContain('## Recent Noise')
    })
  })

  describe('LOOP.md content quality', () => {
    it('documents at least 3 loops', () => {
      const content = read('LOOP.md')
      const loopCount = (content.match(/^### /gm) || []).length
      expect(loopCount).toBeGreaterThanOrEqual(3)
    })

    it('each loop has a valid cadence', () => {
      const content = read('LOOP.md')
      const cadenceMatches = content.match(/Cadence:\s*.+/g)
      expect(cadenceMatches).not.toBeNull()
      expect(cadenceMatches!.length).toBeGreaterThanOrEqual(3)
    })

    it('each loop has a phase designation', () => {
      const content = read('LOOP.md')
      expect(content).toContain('L1')
      expect(content).toContain('L2')
    })

    it('documents multi-loop coordination', () => {
      const content = read('LOOP.md')
      expect(content).toContain('Multi-loop coordination')
    })

    it('documents kill switch', () => {
      const content = read('LOOP.md')
      expect(content).toContain('loop-pause-all')
    })
  })

  describe('loop-budget.md content quality', () => {
    it('has budget entries for all 3 loops', () => {
      const content = read('loop-budget.md')
      expect(content).toContain('Daily Triage')
      expect(content).toContain('PR Babysitter')
      expect(content).toContain('Dependency Sweeper')
    })

    it('token caps are positive numbers', () => {
      const content = read('loop-budget.md')
      const tokenMatches = content.match(/(\d+)k/g)
      expect(tokenMatches).not.toBeNull()
      expect(tokenMatches!.length).toBeGreaterThanOrEqual(3)
      for (const match of tokenMatches!) {
        const num = parseInt(match.replace('k', ''))
        expect(num).toBeGreaterThan(0)
      }
    })

    it('documents budget exceed handling', () => {
      const content = read('loop-budget.md')
      expect(content).toContain('On budget exceed')
      expect(content).toContain('kill switch')
    })
  })

  describe('loop-run-log.md content quality', () => {
    it('has the documented format section', () => {
      const content = read('loop-run-log.md')
      expect(content).toContain('## Format')
    })

    it('has at least one run entry', () => {
      const content = read('loop-run-log.md')
      const entries = content.match(/^## \d{4}-\d{2}-\d{2}/gm)
      expect(entries).not.toBeNull()
      expect(entries!.length).toBeGreaterThanOrEqual(1)
    })

    it('entries have required fields', () => {
      const content = read('loop-run-log.md')
      expect(content).toContain('**Status**:')
      expect(content).toContain('**Findings**:')
      expect(content).toContain('**Actions**:')
      expect(content).toContain('**Tokens**:')
    })
  })
})

describe('Loop Engineering — Workflow Behavior Audit', () => {
  describe('daily-triage.yml', () => {
    it('has kill switch check step', () => {
      const content = readWorkflow('daily-triage.yml')
      expect(content).toContain('loop-pause-all')
      expect(content).toContain('kill-switch')
    })

    it('runs all required checks', () => {
      const content = readWorkflow('daily-triage.yml')
      expect(content).toContain('npm run lint')
      expect(content).toContain('npm run test')
      expect(content).toContain('npm run doctor')
      expect(content).toContain('npm audit')
    })

    it('generates STATE.md', () => {
      const content = readWorkflow('daily-triage.yml')
      expect(content).toContain('STATE.md')
      expect(content).toContain('cat > STATE.md')
    })

    it('appends to loop-run-log.md', () => {
      const content = readWorkflow('daily-triage.yml')
      expect(content).toContain('loop-run-log.md')
      expect(content).toContain('>> loop-run-log.md')
    })

    it('commits STATE.md and run log', () => {
      const content = readWorkflow('daily-triage.yml')
      expect(content).toContain('git add STATE.md loop-run-log.md')
      expect(content).toContain('git commit')
      expect(content).toContain('git push')
    })
  })

  describe('pr-babysitter.yml', () => {
    it('has kill switch check step', () => {
      const content = readWorkflow('pr-babysitter.yml')
      expect(content).toContain('loop-pause-all')
    })

    it('runs quality checks', () => {
      const content = readWorkflow('pr-babysitter.yml')
      expect(content).toContain('npm run lint')
      expect(content).toContain('npm run test')
      expect(content).toContain('npm run doctor')
      expect(content).toContain('npx tsc')
    })

    it('posts PR comment on failure', () => {
      const content = readWorkflow('pr-babysitter.yml')
      expect(content).toContain('github-script')
      expect(content).toContain('createComment')
    })

    it('appends to run log', () => {
      const content = readWorkflow('pr-babysitter.yml')
      expect(content).toContain('loop-run-log.md')
    })
  })

  describe('dependency-sweeper.yml', () => {
    it('has kill switch check step', () => {
      const content = readWorkflow('dependency-sweeper.yml')
      expect(content).toContain('loop-pause-all')
    })

    it('checks npm audit', () => {
      const content = readWorkflow('dependency-sweeper.yml')
      expect(content).toContain('npm audit')
    })

    it('checks npm outdated', () => {
      const content = readWorkflow('dependency-sweeper.yml')
      expect(content).toContain('npm outdated')
    })

    it('has denylist for protected packages', () => {
      const content = readWorkflow('dependency-sweeper.yml')
      expect(content).toContain('next')
      expect(content).toContain('react')
      expect(content).toContain('sanity')
    })

    it('creates PRs for patch updates', () => {
      const content = readWorkflow('dependency-sweeper.yml')
      expect(content).toContain('gh pr create')
    })

    it('updates STATE.md watch list for majors', () => {
      const content = readWorkflow('dependency-sweeper.yml')
      expect(content).toContain('STATE.md')
      expect(content).toContain('Watch List')
    })

    it('appends to run log', () => {
      const content = readWorkflow('dependency-sweeper.yml')
      expect(content).toContain('loop-run-log.md')
    })
  })
})
