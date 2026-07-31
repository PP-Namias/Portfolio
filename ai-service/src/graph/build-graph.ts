import { END, START, StateGraph } from '@langchain/langgraph';

import { RagStateAnnotation } from './types';
import { analyzeIntentNode } from './nodes/analyzeIntent';
import { generateNode } from './nodes/generate';
import { relevanceFilterNode } from './nodes/relevanceFilter';
import { retrieveNode } from './nodes/retrieve';
import { validateNode } from './nodes/validate';
import type { ChatHistoryItem, ChatIntent, RagResult, RagState } from './types';

export const NO_ANSWER_STATUS = 'validate:no-answer-fallback';

function routeAfterIntent(state: RagState): 'retrieve' | 'generate' | 'validate' {
  switch (state.intent) {
    case 'portfolio':
    case 'general':
      return 'retrieve';
    case 'off_topic':
      return 'validate';
    case 'greeting':
    case 'contact':
    default:
      return 'generate';
  }
}

function routeAfterRelevance(state: RagState): 'generate' | 'validate' {
  return state.filteredChunks.length > 0 ? 'generate' : 'validate';
}

export function buildRagGraph() {
  const workflow = new StateGraph(RagStateAnnotation)
    .addNode('analyzeIntent', analyzeIntentNode)
    .addNode('retrieve', retrieveNode)
    .addNode('relevanceFilter', relevanceFilterNode)
    .addNode('generate', generateNode)
    .addNode('validate', validateNode)
    .addEdge(START, 'analyzeIntent')
    .addConditionalEdges('analyzeIntent', routeAfterIntent, ['retrieve', 'generate', 'validate'])
    .addEdge('retrieve', 'relevanceFilter')
    .addConditionalEdges('relevanceFilter', routeAfterRelevance, ['generate', 'validate'])
    .addEdge('generate', 'validate')
    .addEdge('validate', END);

  return workflow.compile();
}

export async function runRag(
  query: string,
  history: ChatHistoryItem[] = [],
  graph = buildRagGraph(),
): Promise<RagResult> {
  const startTime = performance.now();
  const finalState: RagState = await graph.invoke({
    query,
    history,
    intent: 'general',
    reformulatedQuery: query,
  });

  return {
    response: finalState.response,
    intent: finalState.intent as ChatIntent,
    reformulatedQuery: finalState.reformulatedQuery,
    citations: finalState.citations,
    usedContext: finalState.filteredChunks.length > 0,
    validated: finalState.validated,
    status: finalState.status,
    latencyMs: Math.round(performance.now() - startTime),
  };
}
