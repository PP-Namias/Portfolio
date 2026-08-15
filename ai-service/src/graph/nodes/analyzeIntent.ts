import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

import { logger } from '../../lib/logger';
import { createChatModelWithFallback } from '../llm';
import type { ChatIntent, RagState } from '../types';

const INTENT_SYSTEM_PROMPT = `You are a query analyzer for a personal portfolio assistant. Classify the user query and rewrite it for retrieval.

Intent categories:
- portfolio: questions about projects, experience, skills, certifications, education, blog posts, or anything about the person
- greeting: greetings, thanks, small talk
- contact: hiring, contacting, email, meeting, booking, reaching out
- off_topic: anything unrelated to the portfolio owner
- general: everything else

Respond ONLY with a JSON object:
{"intent": "<category>", "reformulatedQuery": "<the user query rewritten as a self-contained, detailed retrieval query with relevant portfolio keywords>"}`;

const CHAT_INTENTS: ChatIntent[] = ['portfolio', 'greeting', 'contact', 'off_topic', 'general'];

function isChatIntent(value: string): value is ChatIntent {
  return (CHAT_INTENTS as string[]).includes(value);
}

export function classifyIntentKeywords(query: string): ChatIntent {
  const message = query.toLowerCase();
  const greetingRegex = /\b(hi|hello|hey|sup|yo|good\s+(morning|afternoon|evening)|thanks|thank\s+you)\b/;
  const contactRegex = /\b(hire|contact|email|meeting|schedule|booking|call|reach|interview)\b/;
  const offTopicRegex = /\b(weather|news|recipe|movie|game|sports|joke)\b/;
  const projectRegex = /\b(project|built|build|created|developed|portfolio|github|repo|experience|skill|technology|tech|stack|framework|certification|education|degree|blog|post)\b/;

  if (greetingRegex.test(message)) {
    return 'greeting';
  }
  if (contactRegex.test(message)) {
    return 'contact';
  }
  if (offTopicRegex.test(message)) {
    return 'off_topic';
  }
  if (projectRegex.test(message)) {
    return 'portfolio';
  }
  return 'general';
}

function extractJson(text: string): { intent?: string; reformulatedQuery?: string } | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return null;
  }
  try {
    const parsed = JSON.parse(match[0]) as unknown;
    if (parsed && typeof parsed === 'object') {
      return parsed as { intent?: string; reformulatedQuery?: string };
    }
    return null;
  } catch {
    return null;
  }
}

function historyMessages(history: RagState['history']): Array<HumanMessage | AIMessage> {
  return history.slice(-4).map((item) =>
    item.role === 'user' ? new HumanMessage(item.content) : new AIMessage(item.content),
  );
}

export async function analyzeIntentNode(state: RagState): Promise<Partial<RagState>> {
  const query = state.query.trim();
  if (!query) {
    return { intent: 'general', reformulatedQuery: query };
  }

  try {
    const model = createChatModelWithFallback();
    const response = await model.invoke([
      new SystemMessage(INTENT_SYSTEM_PROMPT),
      ...historyMessages(state.history),
      new HumanMessage(`User query: ${query}`),
    ]);
    const content = typeof response.content === 'string' ? response.content : '';
    const parsed = extractJson(content);

    if (parsed?.intent && isChatIntent(parsed.intent)) {
      return {
        intent: parsed.intent,
        reformulatedQuery: parsed.reformulatedQuery?.trim() || query,
        status: 'intent:analyzed',
      };
    }
  } catch (error) {
    logger.warn({ err: String(error) }, 'intent LLM call failed, using keyword classifier');
  }

  return {
    intent: classifyIntentKeywords(query),
    reformulatedQuery: query,
    status: 'intent:keyword-fallback',
  };
}
