import { StateGraph, Annotation } from '@langchain/langgraph';
import type { BaseMessage } from '@langchain/core/messages';
import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import type { ChatDataContext, ConversationHistoryMessage } from '@/app/api/chat/lib/types';
import { generateWithGemini, generateWithOpenAI, isMultiProviderEnabled, classifyProviderError } from '@/app/api/chat/lib/providers';
import { buildSystemPrompt } from '@/app/api/chat/lib/promptBuilder';
import { buildSmartFallback } from '@/app/api/chat/lib/smartFallback';
import { retrieve, formatContext, isRagConfigured } from '@/lib/rag/retriever';
import { createTools } from './tools';
import { saveCheckpoint, loadCheckpoint } from './persistence';
import type { ChatIntent, ToolCallResult } from './types';

function getLastUserMessage(messages: BaseMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]._getType() === 'human') {
      return messages[i].content as string;
    }
  }
  return '';
}

function convertHistory(messages: BaseMessage[]): ConversationHistoryMessage[] {
  return messages
    .filter((m) => m._getType() === 'human' || m._getType() === 'ai')
    .slice(0, -1)
    .map((m) => ({
      role: m._getType() === 'human' ? 'user' : 'assistant',
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
    }));
}

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => [...left, ...right],
    default: () => [],
  }),
  threadId: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  chatDataContext: Annotation<ChatDataContext | null>({
    reducer: (curr, next) => next ?? curr,
    default: () => null,
  }),
  ragContext: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  ragChunks: Annotation<unknown[]>({ reducer: (_, next) => next, default: () => [] }),
  intent: Annotation<ChatIntent>({ reducer: (_, next) => next, default: () => 'general' }),
  toolIterations: Annotation<number>({ reducer: (_, next) => next, default: () => 0 }),
  systemPrompt: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  providerAttempts: Annotation<Array<Record<string, unknown>>>({
    reducer: (left, right) => [...left, ...right],
    default: () => [],
  }),
  userMessage: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  history: Annotation<ConversationHistoryMessage[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  toolCallPending: Annotation<string | null>({ reducer: (_, next) => next, default: () => null }),
});

type GraphStateType = typeof GraphState.State;

let cmsContextCache: ChatDataContext | null = null;
let contextLoadPromise: Promise<ChatDataContext> | null = null;

async function loadContextNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
  if (state.chatDataContext) return {};
  try {
    if (!contextLoadPromise) {
      const { getCmsContent } = await import('@/lib/cms-content.server');
      contextLoadPromise = getCmsContent().then((cms) => ({
        profile: cms.profile,
        experiences: cms.experiences,
        projects: cms.projects,
        technologies: cms.technologies,
        certifications: cms.certifications,
        memberships: cms.memberships,
        socials: cms.socialLinks,
      })) as Promise<ChatDataContext>;
    }
    const ctx = await contextLoadPromise;
    cmsContextCache = ctx;
    return { chatDataContext: ctx };
  } catch {
    return {};
  }
}

function classifyIntentNode(state: GraphStateType): Partial<GraphStateType> {
  const msg = state.userMessage.toLowerCase();
  const greetings = ['hi', 'hello', 'hey', 'sup', 'yo', 'good morning', 'good afternoon', 'good evening'];
  const contactWords = ['hire', 'contact', 'email', 'meeting', 'schedule', 'booking', 'call', 'reach'];
  const toolWords = ['calculate', 'calculator', 'stock', 'price', 'search', 'web', 'lookup', 'find', 'google'];

  if (greetings.some((g) => msg.includes(g))) {
    return { intent: 'greeting' };
  }
  if (contactWords.some((w) => msg.includes(w))) {
    return { intent: 'contact' };
  }
  if (toolWords.some((w) => msg.includes(w))) {
    return { intent: 'tool_call' };
  }

  const projectWords = ['project', 'built', 'build', 'create', 'developed', 'portfolio', 'github', 'repo'];
  const skillWords = ['skill', 'technology', 'tech', 'stack', 'language', 'framework', 'tool', 'know', 'expert'];

  if (projectWords.some((w) => msg.includes(w)) || skillWords.some((w) => msg.includes(w))) {
    return { intent: 'rag_query' };
  }
  return { intent: 'general' };
}

async function retrieveContextNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
  if (state.intent !== 'rag_query') return {};
  try {
    if (isRagConfigured()) {
      const chunks = await retrieve(state.userMessage);
      const context = formatContext(chunks);
      return { ragContext: context, ragChunks: chunks };
    }
    return {};
  } catch {
    return {};
  }
}

async function generateNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const systemPrompt = buildSystemPrompt(state.chatDataContext!, state.ragContext);
  const providerAttempts: Array<Record<string, unknown>> = [];
  let responseText = '';

  try {
    const geminiResult = await generateWithGemini(
      state.userMessage,
      state.history,
      systemPrompt
    );
    responseText = geminiResult.message;
    providerAttempts.push({
      provider: geminiResult.provider,
      model: geminiResult.model,
      result: 'success',
    });
  } catch (geminiError) {
    providerAttempts.push({ provider: 'gemini', result: 'error', errorClass: classifyProviderError(geminiError) });

    if (isMultiProviderEnabled()) {
      try {
        const openAiResult = await generateWithOpenAI(
          state.userMessage,
          state.history,
          systemPrompt
        );
        responseText = openAiResult.message;
        providerAttempts.push({
          provider: openAiResult.provider,
          model: openAiResult.model,
          result: 'success',
        });
      } catch (openAiError) {
        providerAttempts.push({ provider: 'openai', result: 'error', errorClass: classifyProviderError(openAiError) });
      }
    }
  }

  if (!responseText) {
    responseText = buildSmartFallback(
      state.userMessage,
      state.chatDataContext!,
      state.ragChunks as []
    );
  }

  const aiMessage = new AIMessage({ content: responseText });
  return {
    messages: [aiMessage],
    systemPrompt,
    providerAttempts,
    toolCallPending: null,
  };
}

function routeToToolNode(state: GraphStateType): string {
  if (state.intent === 'tool_call' && state.toolIterations < 5) {
    return 'executeTool';
  }
  const messages = state.messages;
  if (messages.length > 0) {
    const last = messages[messages.length - 1];
    if (last instanceof AIMessage && last.content && typeof last.content === 'string') {
      const toolTriggers = ['calculate', 'stock price', 'search for', 'web search', 'lookup'];
      const hasToolTrigger = toolTriggers.some((t) => (last.content as string).toLowerCase().includes(t));
      if (hasToolTrigger && state.toolIterations < 5) {
        return 'executeTool';
      }
    }
  }
  return 'end';
}

async function executeToolNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const tools = createTools(() => state.chatDataContext);
  const toolIterations = state.toolIterations + 1;

  let toolResult = '';
  let toolName = '';
  const toolStopped = state.userMessage.toLowerCase();

  if (toolStopped.includes('calculate') || toolStopped.includes('calculator')) {
    toolName = 'calculator';
    const nums = toolStopped.match(/-?\d+(\.\d+)?/g);
    if (nums && nums.length >= 2) {
      const a = parseFloat(nums[0]);
      const b = parseFloat(nums[1]);
      const op = toolStopped.includes('add') || toolStopped.includes('plus') || toolStopped.includes('+') ? 'add'
        : toolStopped.includes('sub') || toolStopped.includes('minus') || toolStopped.includes('-') ? 'sub'
        : toolStopped.includes('mul') || toolStopped.includes('multiply') || toolStopped.includes('times') || toolStopped.includes('*') ? 'mul'
        : toolStopped.includes('div') || toolStopped.includes('divide') || toolStopped.includes('over') || toolStopped.includes('/') ? 'div'
        : 'add';
      const calcTool = tools.find((t) => t.name === 'calculator');
      if (calcTool) {
        toolResult = await calcTool.invoke({ first_num: a, second_num: b, operation: op });
      }
    }
  } else if (toolStopped.includes('stock') || toolStopped.includes('price')) {
    toolName = 'stock_price';
    const symbols = toolStopped.match(/\b[A-Z]{1,5}\b/g);
    const stockSymbol = symbols?.find((s) => s !== 'STOCK' && s !== 'PRICE' && s !== 'PRICES' && s !== 'FOR' && s !== 'THE') || 'AAPL';
    const stockTool = tools.find((t) => t.name === 'stock_price');
    if (stockTool) {
      toolResult = await stockTool.invoke({ symbol: stockSymbol });
    }
  } else if (toolStopped.includes('search') || toolStopped.includes('find') || toolStopped.includes('lookup')) {
    toolName = 'web_search';
    const searchQuery = toolStopped.replace(/search\s+(for\s+)?/i, '').replace(/find\s+/i, '').replace(/lookup\s+/i, '').trim();
    const webTool = tools.find((t) => t.name === 'web_search');
    if (webTool) {
      toolResult = await webTool.invoke({ query: searchQuery || toolStopped });
    }
  } else if (toolStopped.includes('project') || toolStopped.includes('experience') || toolStopped.includes('skill') || toolStopped.includes('certification') || toolStopped.includes('contact')) {
    toolName = 'portfolio_query';
    const portfolioTool = tools.find((t) => t.name === 'portfolio_query');
    if (portfolioTool) {
      const category = toolStopped.includes('project') ? 'projects'
        : toolStopped.includes('experience') ? 'experience'
        : toolStopped.includes('skill') ? 'skills'
        : toolStopped.includes('certification') ? 'certifications'
        : 'contact';
      toolResult = await portfolioTool.invoke({ category });
    }
  } else {
    return { toolIterations, toolCallPending: null };
  }

  const toolMessage = new ToolMessage({
    content: toolResult || 'Tool executed but returned no result.',
    tool_call_id: `${toolName}_${Date.now()}`,
  });

  return {
    messages: [toolMessage],
    toolIterations,
    toolCallPending: toolName,
  };
}

function shouldContinue(state: GraphStateType): string {
  if (state.toolCallPending && state.toolIterations < 5) {
    return 'generate';
  }
  return 'end';
}

function createChatGraph() {
  const workflow = new StateGraph(GraphState)
    .addNode('loadContext', loadContextNode)
    .addNode('classifyIntent', classifyIntentNode)
    .addNode('retrieveContext', retrieveContextNode)
    .addNode('generate', generateNode)
    .addNode('executeTool', executeToolNode)
    .addEdge('__start__', 'loadContext')
    .addEdge('loadContext', 'classifyIntent')
    .addConditionalEdges('classifyIntent', (state: GraphStateType) => {
      if (state.intent === 'greeting' || state.intent === 'contact' || state.intent === 'general') {
        return 'generate';
      }
      return 'retrieveContext';
    }, {
      generate: 'generate',
      retrieveContext: 'retrieveContext',
    })
    .addEdge('retrieveContext', 'generate')
    .addConditionalEdges('generate', routeToToolNode, {
      executeTool: 'executeTool',
      end: '__end__',
    })
    .addEdge('executeTool', 'generate');

  return workflow.compile();
}

let compiledGraph: ReturnType<typeof createChatGraph> | null = null;

export function getCompiledGraph() {
  if (!compiledGraph) {
    compiledGraph = createChatGraph();
  }
  return compiledGraph;
}

export async function runChatGraph(params: {
  message: string;
  history: ConversationHistoryMessage[];
  threadId?: string;
  onToken?: (token: string) => void;
  onToolCall?: (name: string, args: Record<string, unknown>) => void;
  onStatus?: (step: string) => void;
}): Promise<{
  response: string;
  threadId: string;
  toolCalls: ToolCallResult[];
}> {
  const { message, history, threadId: inputThreadId, onToken, onToolCall, onStatus } = params;
  const threadId = inputThreadId || `thread_${Date.now()}`;

  onStatus?.('classifying');

  const graph = getCompiledGraph();
  const savedState = loadCheckpoint(threadId);

  const initialState: Partial<GraphStateType> & { threadId: string } = {
    messages: [],
    threadId,
    userMessage: message,
    history,
    chatDataContext: savedState?.chatDataContext as ChatDataContext | null || null,
    toolIterations: 0,
    providerAttempts: [],
    ragContext: '',
    ragChunks: [],
    intent: 'general',
    systemPrompt: '',
    toolCallPending: null,
  };

  let finalResponse = '';

  try {
    const finalState = await graph.invoke(initialState, {
      configurable: { thread_id: threadId },
    });

    const messages = finalState.messages as BaseMessage[];
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg instanceof AIMessage) {
        finalResponse = typeof lastMsg.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg.content);
      }
    }

    if (!finalResponse) {
      finalResponse = buildSmartFallback(
        message,
        finalState.chatDataContext as ChatDataContext,
        finalState.ragChunks as []
      );
    }

    saveCheckpoint(threadId, finalState as unknown as Record<string, unknown>);

    const tokens = finalResponse.match(/\S+\s*/g) || [finalResponse];
    for (const token of tokens) {
      onToken?.(token);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    onStatus?.('done');

    return {
      response: finalResponse,
      threadId,
      toolCalls: [],
    };
  } catch (error) {
    onStatus?.('error');
    const fallbackResponse = buildSmartFallback(
      message,
      cmsContextCache || { profile: {}, experiences: [], projects: [], technologies: [], certifications: [], memberships: [], socials: [] },
    );
    const tokens = fallbackResponse.match(/\S+\s*/g) || [fallbackResponse];
    for (const token of tokens) {
      onToken?.(token);
    }
    return { response: fallbackResponse, threadId, toolCalls: [] };
  }
}
