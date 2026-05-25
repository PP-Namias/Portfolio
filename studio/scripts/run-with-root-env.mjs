import {existsSync, readFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {spawn} from 'node:child_process'
import process from 'node:process'

const scriptRoot = dirname(fileURLToPath(import.meta.url))
const studioRoot = resolve(scriptRoot, '..')
const repoRoot = resolve(studioRoot, '..')

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {}
  }

  return readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) {
        return acc
      }

      const separatorIndex = trimmed.indexOf('=')

      if (separatorIndex === -1) {
        return acc
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      let value = trimmed.slice(separatorIndex + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      if (key) {
        acc[key] = value
      }

      return acc
    }, {})
}

const envFiles = [
  resolve(repoRoot, '.env.local'),
  resolve(repoRoot, '.env'),
  resolve(studioRoot, '.env.local'),
  resolve(studioRoot, '.env'),
]

const env = {...process.env}

for (const filePath of envFiles) {
  const entries = parseEnvFile(filePath)

  for (const [key, value] of Object.entries(entries)) {
    if (env[key] === undefined || env[key] === '') {
      env[key] = value
    }
  }
}

const [command, ...commandArgs] = process.argv.slice(2)

if (!command) {
  globalThis.console.error('Missing command to run with studio environment loader.')
  process.exit(1)
}

const commandLine = ['npm', 'exec', '--', command, ...commandArgs].join(' ')
const child =
  process.platform === 'win32'
    ? spawn('cmd.exe', ['/d', '/s', '/c', commandLine], {stdio: 'inherit', env})
    : spawn(command, commandArgs, {stdio: 'inherit', env})

child.on('error', (error) => {
  globalThis.console.error(error)
  process.exit(1)
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})