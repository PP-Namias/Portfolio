import { Annotation } from '@langchain/langgraph';

export interface RetrievedChunk {
  id: string;
  docId: string;
  docType: string;
  chunkIndex: number;
  text: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface Citation {
  index: number;
  docId: string;
  docType: string;
  title: string;
  urlPath: string;
  score: number;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatIntent = 'portfolio' | 'greeting' | 'contact' | 'off_topic' | 'general';

export const RagStateAnnotation = Annotation.Root({
  query: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  reformulatedQuery: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  intent: Annotation<ChatIntent>({ reducer: (_, next) => next, default: () => 'general' }),
  history: Annotation<ChatHistoryItem[]>({ reducer: (_, next) => next, default: () => [] }),
  retrievedChunks: Annotation<RetrievedChunk[]>({ reducer: (_, next) => next, default: () => [] }),
  filteredChunks: Annotation<RetrievedChunk[]>({ reducer: (_, next) => next, default: () => [] }),
  citations: Annotation<Citation[]>({ reducer: (_, next) => next, default: () => [] }),
  response: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  validated: Annotation<boolean>({ reducer: (_, next) => next, default: () => false }),
  status: Annotation<string>({ reducer: (_, next) => next, default: () => 'start' }),
});

export type RagState = typeof RagStateAnnotation.State;

export interface RagResult {
  response: string;
  intent: ChatIntent;
  reformulatedQuery: string;
  citations: Citation[];
  usedContext: boolean;
  validated: boolean;
  status: string;
  latencyMs: number;
}
