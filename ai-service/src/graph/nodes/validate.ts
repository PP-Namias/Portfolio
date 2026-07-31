import type { RagState } from '../types';

export function extractCitationIndices(response: string): number[] {
  const matches = response.match(/\[(\d{1,2})\]/g) ?? [];
  const indices = matches
    .map((match) => Number.parseInt(match.slice(1, -1), 10))
    .filter((index) => Number.isFinite(index));
  return [...new Set(indices)];
}

export function buildNoAnswerResponse(state: RagState): string {
  if (state.filteredChunks.length > 0) {
    const topics = [...new Set(state.filteredChunks.map((chunk) => chunk.docType))];
    return `I could not find a confident answer in my knowledge base. I can help with ${topics.join(', ')}. Try asking about PP Namias's projects, experience, skills, certifications, or blog posts.`;
  }
  return `I don't have that information in my knowledge base yet. I can answer questions about PP Namias's projects, experience, skills, certifications, and blog posts.`;
}

export function validateNode(state: RagState): Partial<RagState> {
  let response = state.response.trim();
  const usedContext = state.filteredChunks.length > 0;

  if (!response) {
    return {
      response: buildNoAnswerResponse(state),
      validated: true,
      status: 'validate:no-answer-fallback',
    };
  }

  const validIndices = new Set(state.citations.map((citation) => citation.index));
  const cited = extractCitationIndices(response);
  const invalid = cited.filter((index) => !validIndices.has(index));

  if (usedContext && invalid.length > 0) {
    for (const index of invalid) {
      response = response.replaceAll(`[${index}]`, '');
    }
  }

  if (usedContext && !state.citations.some((citation) => cited.includes(citation.index))) {
    const sources = state.citations.map((citation) => `[${citation.index}] ${citation.title}`).join(', ');
    response = `${response}\n\nSources: ${sources}`;
  }

  return { response: response.trim(), validated: true, status: 'validate:done' };
}
