import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { parse as parseYaml } from 'yaml'

const root = resolve(__dirname, '../../..')
const workflowsDir = join(root, '.github', 'workflows')

function readWorkflow(name: string) {
  return readFileSync(join(workflowsDir, name), 'utf8')
}

function listWorkflows() {
  return readdirSync(workflowsDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
}

function parseWorkflow(name: string) {
  const content = readWorkflow(name)
  return parseYaml(content)
}

describe('Workflow Infrastructure Audit', () => {
  const workflows = listWorkflows()

  it('has at least 20 workflow files', () => {
    expect(workflows.length).toBeGreaterThanOrEqual(20)
  })

  it('every workflow file is valid YAML', () => {
    for (const wf of workflows) {
      expect(() => parseWorkflow(wf)).not.toThrow()
    }
  })

  it('every workflow has a name', () => {
    for (const wf of workflows) {
      const parsed = parseWorkflow(wf)
      expect(parsed.name).toBeDefined()
      expect(typeof parsed.name).toBe('string')
      expect(parsed.name.length).toBeGreaterThan(0)
    }
  })

  it('every workflow has a trigger (on)', () => {
    for (const wf of workflows) {
      const parsed = parseWorkflow(wf)
      expect(parsed.on).toBeDefined()
    }
  })

  it('every workflow has at least one job', () => {
    for (const wf of workflows) {
      const parsed = parseWorkflow(wf)
      expect(parsed.jobs).toBeDefined()
      expect(Object.keys(parsed.jobs).length).toBeGreaterThan(0)
    }
  })

  it('no workflow uses latest tag for actions', () => {
    for (const wf of workflows) {
      const content = readWorkflow(wf)
      const usesLines = content.split('\n').filter((l) => l.trim().startsWith('uses:'))
      for (const line of usesLines) {
        const match = line.match(/uses:\s*(.+)/)
        if (match) {
          const ref = match[1].trim()
          if (
            ref.startsWith('actions/') ||
            ref.startsWith('peter-evans/') ||
            ref.startsWith('github/')
          ) {
            expect(ref).not.toMatch(/@latest$/)
          }
        }
      }
    }
  })

  it('loop-engineering workflows exist', () => {
    expect(existsSync(join(workflowsDir, 'daily-triage.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'pr-babysitter.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'dependency-sweeper.yml'))).toBe(true)
  })

  it('core CI workflows exist', () => {
    expect(existsSync(join(workflowsDir, 'build.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'pr-validation.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'react-doctor.yml'))).toBe(true)
  })

  it('security workflows exist', () => {
    expect(existsSync(join(workflowsDir, 'security-compliance.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'gitleaks.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'checkov.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'trivy-fs.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'osv-scanner.yml'))).toBe(true)
  })

  it('deployment workflows exist', () => {
    expect(existsSync(join(workflowsDir, 'cloudflare-deploy.yml'))).toBe(true)
    expect(existsSync(join(workflowsDir, 'deploy-studio.yml'))).toBe(true)
  })
})
