import { execSync } from 'node:child_process'

const message = process.argv[2]?.trim() || 'chore: AI auto-update'
const root = process.cwd()

function run(cmd) {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { cwd: root, stdio: 'inherit', shell: true })
}

run('git add -A')
run(`git commit -m "${message.replaceAll('"', '\\"')}"`)
run('git push')
console.log('\nCommitted and pushed.')
