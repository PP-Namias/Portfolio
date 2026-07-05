import {defineCliConfig} from 'sanity/cli'
import {loadStudioEnvironment, requireStudioEnv} from './env'

loadStudioEnvironment()

const studioProjectId = requireStudioEnv('SANITY_STUDIO_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID')
const studioDataset = requireStudioEnv('SANITY_STUDIO_DATASET', 'NEXT_PUBLIC_SANITY_DATASET')

export default defineCliConfig({
  api: {
    projectId: studioProjectId,
    dataset: studioDataset,
  },
  deployment: {
    appId: 'rpjnth2yentmovjzzw6tx0xe',
    autoUpdates: false,
  },
})
