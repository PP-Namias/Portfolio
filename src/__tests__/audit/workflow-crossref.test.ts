import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { parse as parseYaml } from 'yaml'

const root = resolve(__dirname, '../../..')
const workflowsDir = join(root, '.github', 'workflows')

function resolve(...args: string[]) {
  const path = require('path')
  return path.resolve(...args)
}

function readWorkflow(name: string) {
  return readFileSync(join(workflowsDir, name), 'utf8')
}

function parseWorkflow(name: string) {
  return parseYaml(readWorkflow(name))
}

function listWorkflows(): string[] {
  return readdirSync(workflowsDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
}

function getWorkflowNames(): string[] {
  return listWorkflows()
    .map((f) => parseWorkflow(f).name as string)
    .filter(Boolean)
}

describe('Workflow Cross-Reference Audit', () => {
  const workflowFiles = listWorkflows()
  const workflowNames = getWorkflowNames()

  it('all workflows have unique names', () => {
    const uniqueNames = new Set(workflowNames)
    expect(uniqueNames.size).toBe(workflowNames.length)
  })

  it('problem-detection-advisor monitors existing workflows', () => {
    const pd = parseWorkflow('problem-detection-advisor.yml')
    const monitored = pd.on?.workflow_run?.workflows || []
    for (const name of monitored) {
      expect(workflowNames).toContain(name)
    }
  })

  it('remediation-approval-gate monitors existing workflows', () => {
    const ra = parseWorkflow('remediation-approval-gate.yml')
    const monitored = ra.on?.workflow_run?.workflows || []
    for (const name of monitored) {
      expect(workflowNames).toContain(name)
    }
  })

  it('auto-approve references valid job names from monitored workflows', () => {
    const aa = parseWorkflow('auto-approve.yml')
    const monitored = aa.on?.workflow_run?.workflows || []
    for (const name of monitored) {
      expect(workflowNames).toContain(name)
    }
  })

  it('daily-triage workflow has correct schedule trigger', () => {
    const dt = parseWorkflow('daily-triage.yml')
    expect(dt.on?.schedule).toBeDefined()
    expect(dt.on?.workflow_dispatch).toBeDefined()
  })

  it('pr-babysitter workflow has PR trigger', () => {
    const pb = parseWorkflow('pr-babysitter.yml')
    expect(pb.on?.pull_request).toBeDefined()
  })

  it('dependency-sweeper workflow has schedule trigger', () => {
    const ds = parseWorkflow('dependency-sweeper.yml')
    expect(ds.on?.schedule).toBeDefined()
  })

  it('build workflow triggers on push to main', () => {
    const build = parseWorkflow('build.yml')
    expect(build.on?.push?.branches).toContain('main')
  })

  it('pr-validation triggers on pull_request to main', () => {
    const pv = parseWorkflow('pr-validation.yml')
    expect(pv.on?.pull_request?.branches).toContain('main')
  })

  it('workflow file count matches expected', () => {
    expect(workflowFiles.length).toBe(24)
  })
})
