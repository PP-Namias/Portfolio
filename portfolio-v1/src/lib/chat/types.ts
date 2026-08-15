import type { BaseMessage } from '@langchain/core/messages';
import type { ChatDataContext, ConversationHistoryMessage } from '@/app/api/chat/lib/types';

export type ChatIntent = 'rag_query' | 'tool_call' | 'general' | 'greeting' | 'contact';

export interface ToolCallResult {
  tool: string;
  input: Record<string, unknown>;
  output: string;
  success: boolean;
  durationMs: number;
}

export interface LangGraphChatState {
  messages: BaseMessage[];
  threadId: string;
  chatDataContext: ChatDataContext | null;
  ragContext: string;
  ragChunks: unknown[];
  intent: ChatIntent;
  toolIterations: number;
  systemPrompt: string;
  providerAttempts: Array<Record<string, unknown>>;
  userMessage: string;
  history: ConversationHistoryMessage[];
}

export interface ThreadMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface PersistedMessage {
  id: number;
  threadId: string;
  role: string;
  content: string;
  toolCalls: string | null;
  createdAt: string;
}

export interface SSEEvent {
  type: 'token' | 'tool_call' | 'status' | 'done' | 'error';
  content?: string;
  name?: string;
  args?: Record<string, unknown>;
  step?: string;
  error?: string;
  threadId?: string;
}
