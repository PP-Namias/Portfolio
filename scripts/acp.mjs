import { spawnSync } from 'node:child_process'

const message = process.argv[2]?.trim() || 'chore: AI auto-update'
const root = process.cwd()

function run(args) {
  console.log(`\n> ${args.join(' ')}`)
  const result = spawnSync(args[0], args.slice(1), { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run(['git', 'add', '-A'])
run(['git', 'commit', '-m', message])
run(['git', 'push'])
console.log('\nCommitted and pushed.')
