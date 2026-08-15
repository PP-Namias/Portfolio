import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const LLMS_PATH = join(process.cwd(), 'public', 'llms.txt')

function readLlmsTxt() {
  return readFileSync(LLMS_PATH, 'utf8')
}

describe('llms.txt for LLM/AEO crawlers', () => {
  it('exists at public/llms.txt', () => {
    expect(existsSync(LLMS_PATH)).toBe(true)
  })

  it('starts with the llms.txt spec: title + site URL blockquote', () => {
    const content = readLlmsTxt()
    expect(content).toMatch(/^# Jhon Keneth Ryan B\. Namias\n/)
    expect(content).toMatch(/^> https:\/\/namias\.tech$/m)
  })

  it('states identity: name, roles, and location', () => {
    const content = readLlmsTxt()
    expect(content).toContain('Jhon Keneth Ryan B. Namias')
    expect(content).toContain('Project Manager, Full Stack Engineer, AI Automation Specialist')
    expect(content).toContain('Caloocan City, Philippines')
  })

  it('documents core competencies: full stack and AI automation', () => {
    const content = readLlmsTxt()
    expect(content).toContain('Flutter')
    expect(content).toContain('NestJS')
    expect(content).toContain('Next.js')
    expect(content).toContain('React-TypeScript')
    expect(content).toContain('PostgreSQL')
    expect(content).toContain('n8n')
    expect(content).toContain('Raspberry Pi')
    expect(content).toContain('Arduino')
  })

  it('covers key projects and professional roles', () => {
    const content = readLlmsTxt()
    expect(content).toContain('Klaro')
    expect(content).toContain('M.A.S.H.')
    expect(content).toContain('Aeternitas Chapels')
    expect(content).toContain('Wilshire Financial Network')
    expect(content).toContain('PhoneCraft')
  })

  it('covers education with Cum Laude honors', () => {
    const content = readLlmsTxt()
    expect(content).toContain('BS Computer Science')
    expect(content).toContain('University of Caloocan City')
    expect(content).toContain('Cum Laude')
  })
})
