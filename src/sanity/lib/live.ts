import {defineLive} from 'next-sanity'

import {API_VERSION} from './client'
import {getStudioEnvSnapshot} from '../../../studio/env'

const env = getStudioEnvSnapshot()

export const {sanityFetch, SanityLive} = defineLive({
  client: {
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: API_VERSION,
    useCdn: true,
    perspective: 'published',
  },
  serverToken: env.readToken,
  browserToken: env.readToken,
})
