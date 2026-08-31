import { describe, it, expect, vi } from 'vitest'

import {
  analyzeWorkflowSource,
  buildProviderMatrix,
  buildRagMatrix,
  classifyEnvFiles,
  findSecretAssignments,
  isAllowedEnvFilename,
  renderMarkdown,
  severityRank,
  summarizeAuditMetadata,
  worstSeverity,
} from '../../../../scripts/system-audit.mjs'

describe('severity helpers', () => {
  it('orders severities worst-first', () => {
    expect(severityRank('fail')).toBeLessThan(severityRank('warn'))
    expect(severityRank('warn')).toBeLessThan(severityRank('info'))
    expect(severityRank('info')).toBeLessThan(severityRank('pass'))
  })

  it('treats an unknown severity as the least severe', () => {
    expect(severityRank('mystery')).toBeGreaterThan(severityRank('pass'))
  })

  it('reduces a list to the worst entry', () => {
    expect(worstSeverity(['pass', 'warn', 'fail'])).toBe('fail')
    expect(worstSeverity(['pass', 'info'])).toBe('info')
    expect(worstSeverity([])).toBe('pass')
  })
})

describe('isAllowedEnvFilename', () => {
  it('allows any template, however it is nested or prefixed', () => {
    expect(isAllowedEnvFilename('.env.example')).toBe(true)
    expect(isAllowedEnvFilename('.env.docker.example')).toBe(true)
    expect(isAllowedEnvFilename('studio/.env.shared.example')).toBe(true)
  })

  it('allows the canary honeypot, whose fake credentials are the point', () => {
    expect(isAllowedEnvFilename('portfolio-v1/public/.env-canary')).toBe(true)
  })

  it('does not allow a real local env file', () => {
    expect(isAllowedEnvFilename('portfolio-v1/.env.local')).toBe(false)
  })
})

describe('findSecretAssignments', () => {
  it('detects provider-shaped credentials and reports the key, never the value', () => {
    const findings = findSecretAssignments(
      [
        'ANTHROPIC_API_KEY=sk-ant-api03-abcdefghijklmnopqrstuvwxyz0123456789',
        'GOOGLE_GEMINI_API_KEY=AIzaSyDfHPOnuDVyGq8WJvtZg4KOhqvVVEpHwUxx',
      ].join('\n')
    )

    expect(findings).toEqual([
      { key: 'ANTHROPIC_API_KEY', line: 1 },
      { key: 'GOOGLE_GEMINI_API_KEY', line: 2 },
    ])
    expect(JSON.stringify(findings)).not.toContain('sk-ant')
  })

  it('ignores placeholders, blanks, and comments', () => {
    const findings = findSecretAssignments(
      [
        '# ANTHROPIC_API_KEY=sk-ant-api03-abcdefghijklmnopqrstuvwxyz0123456789',
        'ANTHROPIC_API_KEY=your_anthropic_api_key',
        'CLAUDE_MODEL=claude-sonnet-5',
        'CHAT_MULTI_PROVIDER_ENABLED=false',
        'EMPTY=',
      ].join('\n')
    )

    expect(findings).toEqual([])
  })

  it('strips surrounding quotes before matching', () => {
    const findings = findSecretAssignments(
      'TOKEN="sk-ant-api03-abcdefghijklmnopqrstuvwxyz0123456789"'
    )

    expect(findings).toEqual([{ key: 'TOKEN', line: 1 }])
  })
})

describe('classifyEnvFiles', () => {
  it('allows templates by name without reading them', () => {
    const readFile = vi.fn()
    const { allowed, leaked } = classifyEnvFiles(
      ['.env.example', 'studio/.env.shared.example', 'src/index.ts'],
      readFile
    )

    expect(allowed).toEqual(['.env.example', 'studio/.env.shared.example'])
    expect(leaked).toEqual([])
    expect(readFile).not.toHaveBeenCalled()
  })

  it('flags a tracked env file only when it assigns a real credential', () => {
    const { allowed, leaked } = classifyEnvFiles(
      ['portfolio-v1/.env.vercel', 'portfolio-v1/.env.local'],
      (file) =>
        file.endsWith('.env.local')
          ? 'ANTHROPIC_API_KEY=sk-ant-api03-abcdefghijklmnopqrstuvwxyz0123456789'
          : 'SANITY_API_READ_TOKEN=your_sanity_api_read_token'
    )

    // The template is tracked but harmless, so it is not reported as a leak.
    expect(allowed).toEqual(['portfolio-v1/.env.vercel'])
    expect(leaked).toEqual([
      { file: 'portfolio-v1/.env.local', secrets: [{ key: 'ANTHROPIC_API_KEY', line: 1 }] },
    ])
  })

  it('treats every non-template as suspect when no reader is supplied', () => {
    const { leaked } = classifyEnvFiles(['portfolio-v1/.env.local'])

    expect(leaked).toEqual([{ file: 'portfolio-v1/.env.local', secrets: [] }])
  })

  it('ignores files that merely contain "env"', () => {
    const { allowed, leaked } = classifyEnvFiles(
      ['src/environment.ts', 'docs/env-setup.md'],
      () => ''
    )

    expect(allowed).toEqual([])
    expect(leaked).toEqual([])
  })
})

describe('summarizeAuditMetadata', () => {
  it('fails on critical or high advisories', () => {
    const summary = summarizeAuditMetadata({
      metadata: { vulnerabilities: { critical: 0, high: 2, moderate: 1, low: 0, info: 0 } },
    })

    expect(summary.severity).toBe('fail')
    expect(summary.total).toBe(3)
  })

  it('warns on moderate-only advisories', () => {
    const summary = summarizeAuditMetadata({
      metadata: { vulnerabilities: { critical: 0, high: 0, moderate: 4, low: 1, info: 0 } },
    })

    expect(summary.severity).toBe('warn')
    expect(summary.total).toBe(5)
  })

  it('passes on a clean audit and tolerates a missing metadata block', () => {
    expect(summarizeAuditMetadata({ metadata: { vulnerabilities: {} } }).severity).toBe('pass')
    expect(summarizeAuditMetadata({}).total).toBe(0)
  })
})

describe('analyzeWorkflowSource', () => {
  const HARDENED = `name: Example
permissions:
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5
        with:
          persist-credentials: false
`

  it('reports no findings for a hardened workflow', () => {
    const result = analyzeWorkflowSource('example.yml', HARDENED)

    expect(result.findings).toEqual([])
    expect(result.severity).toBe('pass')
  })

  it('flags an action pinned to a tag instead of a SHA', () => {
    const result = analyzeWorkflowSource(
      'example.yml',
      HARDENED.replace(
        'actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5',
        'actions/checkout@v4'
      )
    )

    expect(result.findings.map((finding) => finding.rule)).toContain('unpinned-action')
  })

  it('flags a missing top-level permissions block', () => {
    const result = analyzeWorkflowSource(
      'example.yml',
      HARDENED.replace('permissions:\n  contents: read\n', '')
    )

    expect(result.findings.map((finding) => finding.rule)).toContain(
      'missing-top-level-permissions'
    )
  })

  it('flags a checkout that keeps the token on disk', () => {
    const result = analyzeWorkflowSource(
      'example.yml',
      HARDENED.replace('        with:\n          persist-credentials: false\n', '')
    )

    expect(result.findings.map((finding) => finding.rule)).toContain(
      'checkout-persists-credentials'
    )
  })

  it('does not ask local composite actions to be SHA-pinned', () => {
    const result = analyzeWorkflowSource(
      'example.yml',
      `${HARDENED}      - uses: ./.github/actions/setup\n`
    )

    expect(result.findings).toEqual([])
  })

  it('records the line number of each finding', () => {
    const result = analyzeWorkflowSource(
      'example.yml',
      HARDENED.replace('@34e114876b0b11c390a56381ad16ebd13914f8d5', '@v4')
    )
    const finding = result.findings.find((entry) => entry.rule === 'unpinned-action')

    expect(finding?.line).toBe(9)
  })
})

describe('buildProviderMatrix', () => {
  it('names the first configured provider in the order as primary', () => {
    const matrix = buildProviderMatrix({
      CHAT_PROVIDER_ORDER: 'claude,gemini,openai',
      ANTHROPIC_API_KEY: 'key',
      GOOGLE_GEMINI_API_KEY: 'key',
    })

    expect(matrix.primary).toBe('claude')
    expect(matrix.severity).toBe('pass')
  })

  it('skips an unconfigured provider when picking the primary', () => {
    const matrix = buildProviderMatrix({
      CHAT_PROVIDER_ORDER: 'claude,gemini',
      GOOGLE_GEMINI_API_KEY: 'key',
    })

    expect(matrix.primary).toBe('gemini')
    expect(matrix.configured.claude).toBe(false)
  })

  it('fails when no provider can answer', () => {
    const matrix = buildProviderMatrix({})

    expect(matrix.primary).toBeNull()
    expect(matrix.severity).toBe('fail')
    expect(matrix.order).toEqual(['claude', 'gemini', 'openai'])
  })

  it('reads the multi-provider flag', () => {
    expect(buildProviderMatrix({ CHAT_MULTI_PROVIDER_ENABLED: 'true' }).multiProviderEnabled).toBe(
      true
    )
    expect(buildProviderMatrix({ CHAT_MULTI_PROVIDER_ENABLED: 'no' }).multiProviderEnabled).toBe(
      false
    )
  })
})

describe('buildRagMatrix', () => {
  it('passes when the vector store and the embedding key are present', () => {
    const matrix = buildRagMatrix({
      UPSTASH_VECTOR_URL: 'url',
      UPSTASH_VECTOR_TOKEN: 'token',
      GOOGLE_GEMINI_API_KEY: 'key',
    })

    expect(matrix.missing).toEqual([])
    expect(matrix.severity).toBe('pass')
  })

  it('still requires the Gemini key, since embeddings never run on Claude', () => {
    const matrix = buildRagMatrix({
      UPSTASH_VECTOR_URL: 'url',
      UPSTASH_VECTOR_TOKEN: 'token',
      ANTHROPIC_API_KEY: 'key',
    })

    expect(matrix.missing).toEqual(['GOOGLE_GEMINI_API_KEY'])
    expect(matrix.severity).toBe('warn')
  })
})

describe('renderMarkdown', () => {
  it('renders a summary table and per-section details', () => {
    const markdown = renderMarkdown({
      generatedAt: '2026-09-01T00:00:00.000Z',
      commit: 'abc1234',
      severity: 'warn',
      sections: [
        {
          title: 'Dependency + secret hygiene',
          severity: 'pass',
          summary: '4 workspaces audited',
          details: ['No unexpected env files tracked.'],
        },
        {
          title: 'CI/workflow hardening',
          severity: 'warn',
          summary: '3/25 workflows flagged',
          details: [],
        },
      ],
    })

    expect(markdown).toContain('| Dependency + secret hygiene | pass | 4 workspaces audited |')
    expect(markdown).toContain('**Overall: warn**')
    expect(markdown).toContain('## Dependency + secret hygiene')
    // A section with no details gets a table row but no detail heading.
    expect(markdown).not.toContain('## CI/workflow hardening')
  })
})
