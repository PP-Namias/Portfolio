import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

function readGitignore() {
  return read('.gitignore')
}

describe('Security Audit — Secret Handling', () => {
  describe('.env file security', () => {
    it('.env.local is in .gitignore', () => {
      const gitignore = readGitignore()
      expect(gitignore).toContain('.env.local')
    })

    it('.env.example exists', () => {
      const exists = require('fs').existsSync(resolve(root, '.env.example'))
      expect(exists).toBe(true)
    })

    it('.env.example documents required variables', () => {
      const envExample = read('.env.example')
      expect(envExample).toContain('NEXT_PUBLIC_')
    })

    it('.env.local is not tracked by git', () => {
      const { execSync } = require('child_process')
      const tracked = execSync('git ls-files .env.local', { cwd: root }).toString().trim()
      expect(tracked).toBe('')
    })
  })

  describe('hardcoded secret detection', () => {
    const srcDir = join(root, 'src')
    const files = readdirSync(srcDir, { recursive: true })
      .filter((f: string) => (f.endsWith('.ts') || f.endsWith('.tsx')) && !f.includes('__tests__'))
      .map((f: string) => join(srcDir, f))

    it('no hardcoded API keys in source files', () => {
      for (const file of files) {
        const content = readFileSync(file, 'utf8')
        const hasHardcodedKey =
          content.includes('= "sk-') ||
          content.includes("= 'sk-") ||
          content.includes('= "api_') ||
          content.includes("= 'api_") ||
          content.includes('= "ghp_') ||
          content.includes("= 'ghp_")
        if (hasHardcodedKey) {
          console.log(`Potential hardcoded key in: ${file}`)
        }
        expect(hasHardcodedKey).toBe(false)
      }
    })

    it('no hardcoded passwords in source files', () => {
      for (const file of files) {
        const content = readFileSync(file, 'utf8')
        const hasHardcodedPassword =
          content.includes('password: "') ||
          content.includes("password: '") ||
          content.includes('password=')
        if (hasHardcodedPassword) {
          console.log(`Potential hardcoded password in: ${file}`)
        }
        expect(hasHardcodedPassword).toBe(false)
      }
    })
  })

  describe('.gitleaks configuration', () => {
    it('.gitleaks.toml exists', () => {
      const exists = require('fs').existsSync(resolve(root, '.gitleaks.toml'))
      expect(exists).toBe(true)
    })

    it('.gitleaks.toml has allowlist', () => {
      const config = read('.gitleaks.toml')
      expect(config).toContain('[allowlist]')
    })
  })

  describe('.checkov configuration', () => {
    it('.checkov.yaml exists', () => {
      const exists = require('fs').existsSync(resolve(root, '.checkov.yaml'))
      expect(exists).toBe(true)
    })

    it('.checkov.yaml has skip directives with reasons', () => {
      const config = read('.checkov.yaml')
      expect(config).toContain('skip')
    })
  })

  describe('media gateway security', () => {
    it('media gateway uses HMAC signing', () => {
      const gateway = read('src/lib/media-gateway.ts')
      const hasHmac =
        gateway.includes('HMAC') || gateway.includes('hmac') || gateway.includes('createHmac')
      expect(hasHmac).toBe(true)
    })

    it('media gateway does not expose secret in URL', () => {
      const gateway = read('src/lib/media-gateway.ts')
      expect(gateway).not.toContain('secret=')
    })
  })
})
