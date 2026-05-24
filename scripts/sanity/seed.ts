import {phaseOneSanityManifest} from './manifest'

export interface SanitySeedResult {
  sourceFile: string
  status: 'pending' | 'created' | 'updated' | 'skipped' | 'failed'
  message: string
}

export function buildPhaseOneSeedPlan(): SanitySeedResult[] {
  return phaseOneSanityManifest.map((entry) => ({
    sourceFile: entry.sourceFile,
    status: 'pending',
    message: `Ready to import into ${entry.targetModel}`,
  }))
}

export function logPhaseOneSeedPlan() {
  const seedPlan = buildPhaseOneSeedPlan()
  console.log('Phase 1 Sanity seed plan')
  console.log('------------------------')

  for (const item of seedPlan) {
    console.log(`[${item.status.toUpperCase()}] ${item.sourceFile}`)
    console.log(`  ${item.message}`)
  }
}
