import { execSync } from 'node:child_process'
import { cpSync, rmSync } from 'node:fs'

const APP_DIR = 'portfolio-v1'

execSync('npm ci', { cwd: APP_DIR, stdio: 'inherit' })
execSync('npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion', {
  cwd: APP_DIR,
  stdio: 'inherit',
})

rmSync('.open-next', { recursive: true, force: true })
cpSync(`${APP_DIR}/.open-next`, '.open-next', { recursive: true })