import {phaseOneMigrationTasks, summarizePhaseOneManifest} from './manifest'

function printDryRunPlan() {
  console.log('Phase 1 Sanity migration dry run')
  console.log('--------------------------------')
  console.log(summarizePhaseOneManifest())
  console.log('')
  console.log('Execution order:')

  for (const task of phaseOneMigrationTasks) {
    console.log(`- ${task}`)
  }
}

printDryRunPlan()
