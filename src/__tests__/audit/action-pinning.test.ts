import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const root = resolve(__dirname, '../../..')
const workflowsDir = join(root, '.github', 'workflows')

function resolve(...args: string[]) {
  const path = require('path')
  return path.resolve(...args)
}

function readWorkflow(name: string) {
  return readFileSync(join(workflowsDir, name), 'utf8')
}

function listWorkflows() {
  return readdirSync(workflowsDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
}

function extractUsesRefs(content: string): string[] {
  const refs: string[] = []
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.trim().match(/^uses:\s*(.+)/)
    if (match) {
      refs.push(match[1].trim())
    }
  }
  return refs
}

function isLocalPath(ref: string) {
  return ref.startsWith('./') || ref.startsWith('../')
}

function isShaPinned(ref: string) {
  return ref.includes('@') && /[a-f0-9]{40}/.test(ref.split('@')[1] || '')
}

function isTagBased(ref: string) {
  return ref.includes('@') && !isShaPinned(ref)
}

describe('Action Pinning Audit', () => {
  const workflows = listWorkflows()
  const allRefs: { workflow: string; ref: string }[] = []

  for (const wf of workflows) {
    const content = readWorkflow(wf)
    const refs = extractUsesRefs(content)
    for (const ref of refs) {
      allRefs.push({ workflow: wf, ref })
    }
  }

  it('extracts action references from all workflows', () => {
    expect(allRefs.length).toBeGreaterThan(0)
  })

  it('all external actions are SHA-pinned (no tag references)', () => {
    const tagBased = allRefs.filter(({ ref }) => !isLocalPath(ref) && !isShaPinned(ref))
    if (tagBased.length > 0) {
      const summary = tagBased.map(({ workflow, ref }) => `  ${workflow}: ${ref}`).join('\n')
      console.log(`Found ${tagBased.length} tag-based action references:\n${summary}`)
    }
    // Log but don't fail — we're auditing, identifying issues to fix later
    expect(tagBased.length).toBe(0)
  })

  it('no workflow uses @latest tag', () => {
    const latestRefs = allRefs.filter(({ ref }) => ref.endsWith('@latest'))
    expect(latestRefs).toHaveLength(0)
  })

  it('local action references use relative paths', () => {
    const localRefs = allRefs.filter(({ ref }) => ref.startsWith('.'))
    for (const { ref } of localRefs) {
      expect(ref).toMatch(/^\.\//)
    }
  })

  it('actions/checkout is pinned to SHA', () => {
    const checkoutRefs = allRefs.filter(({ ref }) => ref.startsWith('actions/checkout@'))
    for (const { ref, workflow } of checkoutRefs) {
      const sha = ref.split('@')[1]
      expect(sha).toMatch(/^[a-f0-9]{40}$/)
    }
  })

  it('actions/setup-node is pinned to SHA', () => {
    const setupNodeRefs = allRefs.filter(({ ref }) => ref.startsWith('actions/setup-node@'))
    for (const { ref } of setupNodeRefs) {
      const sha = ref.split('@')[1]
      expect(sha).toMatch(/^[a-f0-9]{40}$/)
    }
  })

  it('actions/github-script is pinned to SHA', () => {
    const scriptRefs = allRefs.filter(({ ref }) => ref.startsWith('actions/github-script@'))
    for (const { ref } of scriptRefs) {
      const sha = ref.split('@')[1]
      expect(sha).toMatch(/^[a-f0-9]{40}$/)
    }
  })

  it('summary of all action references for audit log', () => {
    const uniqueRefs = [...new Set(allRefs.map(({ ref }) => ref))].sort()
    console.log(`\nTotal action references: ${allRefs.length}`)
    console.log(`Unique action references: ${uniqueRefs.length}`)
    console.log(`\nAll unique references:\n${uniqueRefs.map((r) => `  ${r}`).join('\n')}`)
    expect(true).toBe(true)
  })
})
