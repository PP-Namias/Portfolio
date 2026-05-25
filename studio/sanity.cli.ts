import {defineCliConfig} from 'sanity/cli'
import {loadStudioEnvironment, requireStudioEnv} from './env'

loadStudioEnvironment()

const projectId = requireStudioEnv('NEXT_PUBLIC_SANITY_PROJECT_ID')
const dataset = requireStudioEnv('NEXT_PUBLIC_SANITY_DATASET')

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    autoUpdates: true,
  },
})
