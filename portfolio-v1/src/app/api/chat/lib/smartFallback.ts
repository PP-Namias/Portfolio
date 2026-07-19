import { RetrievedChunk } from '@/lib/rag/types'
import { ChatDataContext } from './types'
import { buildRagResponse } from './ragResponseBuilder'
import { buildCatalogResponse } from './questionCatalog'

export function buildSmartFallback(
  message: string,
  data: ChatDataContext,
  ragChunks?: RetrievedChunk[]
): string {
  if (ragChunks && ragChunks.length > 0) {
    const ragResponse = buildRagResponse(ragChunks, message, data)
    if (ragResponse) return ragResponse
  }

  const catalogResponse = buildCatalogResponse(message, data)
  if (catalogResponse) return catalogResponse

  const name = data.profile.name || 'Jhon Keneth Ryan Namias'
  const title = data.profile.title || 'Full Stack Engineer & AI Automation Specialist'
  return `${name} is a ${title} with ${data.profile.highlights?.yearsExperience ?? 3}+ years of experience. Feel free to ask about his projects, experience, skills, or contact information!`
}
