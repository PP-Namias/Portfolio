import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

import { logger } from '../../lib/logger';
import { createChatModelWithFallback } from '../llm';
import type { RagState } from '../types';

export function buildRagSystemPrompt(query: string, chunks: RagState['filteredChunks']): string {
  if (chunks.length === 0) {
    return `You are the AI assistant for PP Namias's portfolio website. Answer the user's question conversationally and honestly. If you do not know the answer, say so. Keep answers concise, friendly, and helpful.`;
  }

  const context = chunks.map((chunk, index) => `[${index + 1}] ${chunk.text}`).join('\n\n');

  return `You are the AI assistant for PP Namias's portfolio website. Answer the user's question ONLY using the context below.

Rules:
- Cite the source number in brackets (e.g. [1]) after each claim you make from the context.
- Never invent facts that are not in the context.
- If the context does not contain the answer, say you cannot answer from the available information and suggest related topics.
- Keep the answer concise and helpful.

=== CONTEXT ===
${context}
=== END CONTEXT ===`;
}

function historyMessages(history: RagState['history']): Array<HumanMessage | AIMessage> {
  return history.slice(-6).map((item) =>
    item.role === 'user' ? new HumanMessage(item.content) : new AIMessage(item.content),
  );
}

export async function generateNode(state: RagState): Promise<Partial<RagState>> {
  try {
    const model = createChatModelWithFallback();
    const systemPrompt = buildRagSystemPrompt(state.query, state.filteredChunks);
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      ...historyMessages(state.history),
      new HumanMessage(state.query),
    ]);
    const text = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
    return { response: text.trim(), status: 'generate:done' };
  } catch (error) {
    logger.warn({ err: String(error) }, 'generation failed');
    return { response: '', status: 'generate:error' };
  }
}
