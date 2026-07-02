import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'
import { parse as parseYaml } from 'yaml'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

function readWorkflow(name: string) {
  return readFileSync(resolve(root, '.github', 'workflows', name), 'utf8')
}

describe('Loop Engineering — Consistency Audit', () => {
  describe('cross-file consistency', () => {
    it('every loop in LOOP.md has a matching workflow file', () => {
      const loopContent = read('LOOP.md')
      const loopWorkflows = [
        { name: 'Daily Triage', file: 'daily-triage.yml' },
        { name: 'PR Babysitter', file: 'pr-babysitter.yml' },
        { name: 'Dependency Sweeper', file: 'dependency-sweeper.yml' },
      ]

      for (const { name, file } of loopWorkflows) {
        expect(loopContent).toContain(name)
        const exists = require('fs').existsSync(resolve(root, '.github', 'workflows', file))
        expect(exists).toBe(true)
      }
    })

    it('every loop workflow references the correct loop name in run log', () => {
      const dt = readWorkflow('daily-triage.yml')
      expect(dt).toContain('daily-triage')

      const pb = readWorkflow('pr-babysitter.yml')
      expect(pb).toContain('pr-babysitter')

      const ds = readWorkflow('dependency-sweeper.yml')
      expect(ds).toContain('dependency-sweeper')
    })

    it('loop-budget.md lists every loop from LOOP.md', () => {
      const budget = read('loop-budget.md')
      expect(budget).toContain('Daily Triage')
      expect(budget).toContain('PR Babysitter')
      expect(budget).toContain('Dependency Sweeper')
    })

    it('AGENTS.md lists all 3 active loops', () => {
      const agents = read('AGENTS.md')
      expect(agents).toContain('Daily Triage')
      expect(agents).toContain('PR Babysitter')
      expect(agents).toContain('Dependency Sweeper')
    })

    it('AGENTS.md references all core files', () => {
      const agents = read('AGENTS.md')
      expect(agents).toContain('STATE.md')
      expect(agents).toContain('LOOP.md')
      expect(agents).toContain('loop-budget.md')
      expect(agents).toContain('loop-run-log.md')
    })

    it('AGENTS.md references kill switch label', () => {
      const agents = read('AGENTS.md')
      expect(agents).toContain('loop-pause-all')
    })

    it('skill file references all core files', () => {
      const skill = read('.agents/skills/loop-engineering/SKILL.md')
      expect(skill).toContain('STATE.md')
      expect(skill).toContain('LOOP.md')
      expect(skill).toContain('loop-budget.md')
      expect(skill).toContain('loop-run-log.md')
    })

    it('skill file references all 3 loops', () => {
      const skill = read('.agents/skills/loop-engineering/SKILL.md')
      expect(skill).toContain('Daily Triage')
      expect(skill).toContain('PR Babysitter')
      expect(skill).toContain('Dependency Sweeper')
    })

    it('skill file documents kill switch', () => {
      const skill = read('.agents/skills/loop-engineering/SKILL.md')
      expect(skill).toContain('loop-pause-all')
    })
  })

  describe('npm script consistency', () => {
    it('package.json has loop:status script', () => {
      const pkg = JSON.parse(read('package.json'))
      expect(pkg.scripts['loop:status']).toBeDefined()
      expect(pkg.scripts['loop:status']).toBe('cat STATE.md')
    })

    it('package.json has loop:log script', () => {
      const pkg = JSON.parse(read('package.json'))
      expect(pkg.scripts['loop:log']).toBeDefined()
      expect(pkg.scripts['loop:log']).toBe('tail -20 loop-run-log.md')
    })

    it('package.json has loop:budget script', () => {
      const pkg = JSON.parse(read('package.json'))
      expect(pkg.scripts['loop:budget']).toBeDefined()
      expect(pkg.scripts['loop:budget']).toBe('cat loop-budget.md')
    })
  })
})
