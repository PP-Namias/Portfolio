import { StateGraph, Annotation } from '@langchain/langgraph'
import type { BaseMessage } from '@langchain/core/messages'
import { AIMessage, ToolMessage } from '@langchain/core/messages'
import type { ChatDataContext, ConversationHistoryMessage } from '@/app/api/chat/lib/types'
import { generateWithProviderChain, streamWithProviderChain } from '@/app/api/chat/lib/providers'
import { buildSystemPromptParts } from '@/app/api/chat/lib/promptBuilder'
import { buildSmartFallback } from '@/app/api/chat/lib/smartFallback'
import { retrieve, formatContext, isRagConfigured } from '@/lib/rag/retriever'
import { createTools } from './tools'
import { saveCheckpoint, loadCheckpoint } from './persistence'
import type { ChatIntent, ToolCallResult } from './types'

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
  toolContext: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
})

type GraphStateType = typeof GraphState.State

interface ChatGraphOptions {
  onToken?: (token: string) => void
  onToolCall?: (name: string, args: Record<string, unknown>) => void
}

let cmsContextCache: ChatDataContext | null = null
let contextLoadPromise: Promise<ChatDataContext> | null = null

async function loadContextNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
  if (state.chatDataContext) return {}
  try {
    if (!contextLoadPromise) {
      const { getCmsContent } = await import('@/lib/cms-content.server')
      contextLoadPromise = getCmsContent().then((cms) => ({
        profile: cms.profile,
        experiences: cms.experiences,
        projects: cms.projects,
        technologies: cms.technologies,
        certifications: cms.certifications,
        memberships: cms.memberships,
        socials: cms.socialLinks,
      })) as Promise<ChatDataContext>
    }
    const ctx = await contextLoadPromise
    cmsContextCache = ctx
    return { chatDataContext: ctx }
  } catch {
    return {}
  }
}

function classifyIntentNode(state: GraphStateType): Partial<GraphStateType> {
  const msg = state.userMessage.toLowerCase()
  const greetings = [
    'hi',
    'hello',
    'hey',
    'sup',
    'yo',
    'good morning',
    'good afternoon',
    'good evening',
  ]
  const contactWords = [
    'hire',
    'contact',
    'email',
    'meeting',
    'schedule',
    'booking',
    'call',
    'reach',
  ]
  const toolWords = [
    'calculate',
    'calculator',
    'stock',
    'price',
    'search',
    'web',
    'lookup',
    'find',
    'google',
  ]

  if (greetings.some((g) => msg.includes(g))) {
    return { intent: 'greeting' }
  }
  if (contactWords.some((w) => msg.includes(w))) {
    return { intent: 'contact' }
  }
  if (toolWords.some((w) => msg.includes(w))) {
    return { intent: 'tool_call' }
  }

  const projectWords = [
    'project',
    'built',
    'build',
    'create',
    'developed',
    'portfolio',
    'github',
    'repo',
  ]
  const skillWords = [
    'skill',
    'technology',
    'tech',
    'stack',
    'language',
    'framework',
    'tool',
    'know',
    'expert',
  ]

  if (projectWords.some((w) => msg.includes(w)) || skillWords.some((w) => msg.includes(w))) {
    return { intent: 'rag_query' }
  }
  return { intent: 'general' }
}

async function retrieveContextNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
  if (state.intent !== 'rag_query') return {}
  try {
    if (isRagConfigured()) {
      const chunks = await retrieve(state.userMessage)
      const context = formatContext(chunks)
      return { ragContext: context, ragChunks: chunks }
    }
    return {}
  } catch {
    return {}
  }
}

function buildMessageForProvider(state: GraphStateType): string {
  if (state.toolContext) {
    return `${state.userMessage}\n\nTool result:\n${state.toolContext}`
  }
  return state.userMessage
}

function createGenerateNode(options: ChatGraphOptions) {
  return async function generateNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
    const promptParts = buildSystemPromptParts(state.chatDataContext!, state.ragContext)
    const messageForProvider = buildMessageForProvider(state)

    // Both paths walk CHAT_PROVIDER_ORDER; the chain owns failover so this node
    // no longer duplicates the logic that also lives in the chat route.
    const { result, attempts: providerAttempts } = options.onToken
      ? await streamWithProviderChain(messageForProvider, state.history, promptParts, {
          onChunk: options.onToken,
        })
      : await generateWithProviderChain(messageForProvider, state.history, promptParts)

    let responseText = result?.message ?? ''

    if (!responseText) {
      responseText = buildSmartFallback(
        state.userMessage,
        state.chatDataContext!,
        state.ragChunks as []
      )
    }

    const aiMessage = new AIMessage({ content: responseText })
    return {
      messages: [aiMessage],
      systemPrompt: `${promptParts.stable}${promptParts.volatile}`,
      providerAttempts,
      toolCallPending: null,
    }
  }
}

function createExecuteToolNode(options: ChatGraphOptions) {
  return async function executeToolNode(state: GraphStateType): Promise<Partial<GraphStateType>> {
    const tools = createTools(() => state.chatDataContext)
    const toolIterations = state.toolIterations + 1

    let toolResult = ''
    let toolName = ''
    let toolArgs: Record<string, unknown> = {}
    const toolStopped = state.userMessage.toLowerCase()

    if (toolStopped.includes('calculate') || toolStopped.includes('calculator')) {
      toolName = 'calculator'
      const nums = toolStopped.match(/-?\d+(\.\d+)?/g)
      if (nums && nums.length >= 2) {
        const a = parseFloat(nums[0])
        const b = parseFloat(nums[1])
        const op =
          toolStopped.includes('add') || toolStopped.includes('plus') || toolStopped.includes('+')
            ? 'add'
            : toolStopped.includes('sub') ||
                toolStopped.includes('minus') ||
                toolStopped.includes('-')
              ? 'sub'
              : toolStopped.includes('mul') ||
                  toolStopped.includes('multiply') ||
                  toolStopped.includes('times') ||
                  toolStopped.includes('*')
                ? 'mul'
                : toolStopped.includes('div') ||
                    toolStopped.includes('divide') ||
                    toolStopped.includes('over') ||
                    toolStopped.includes('/')
                  ? 'div'
                  : 'add'
        toolArgs = { first_num: a, second_num: b, operation: op }
        const calcTool = tools.find((t) => t.name === 'calculator')
        if (calcTool) {
          toolResult = await calcTool.invoke(toolArgs)
        }
      }
    } else if (toolStopped.includes('stock') || toolStopped.includes('price')) {
      toolName = 'stock_price'
      const symbols = toolStopped.match(/\b[A-Z]{1,5}\b/g)
      const stockSymbol =
        symbols?.find(
          (s) => s !== 'STOCK' && s !== 'PRICE' && s !== 'PRICES' && s !== 'FOR' && s !== 'THE'
        ) || 'AAPL'
      toolArgs = { symbol: stockSymbol }
      const stockTool = tools.find((t) => t.name === 'stock_price')
      if (stockTool) {
        toolResult = await stockTool.invoke(toolArgs)
      }
    } else if (
      toolStopped.includes('search') ||
      toolStopped.includes('find') ||
      toolStopped.includes('lookup')
    ) {
      toolName = 'web_search'
      const searchQuery = toolStopped
        .replace(/search\s+(for\s+)?/i, '')
        .replace(/find\s+/i, '')
        .replace(/lookup\s+/i, '')
        .trim()
      toolArgs = { query: searchQuery || toolStopped }
      const webTool = tools.find((t) => t.name === 'web_search')
      if (webTool) {
        toolResult = await webTool.invoke(toolArgs)
      }
    } else if (
      toolStopped.includes('project') ||
      toolStopped.includes('experience') ||
      toolStopped.includes('skill') ||
      toolStopped.includes('certification') ||
      toolStopped.includes('contact')
    ) {
      toolName = 'portfolio_query'
      const category = toolStopped.includes('project')
        ? 'projects'
        : toolStopped.includes('experience')
          ? 'experience'
          : toolStopped.includes('skill')
            ? 'skills'
            : toolStopped.includes('certification')
              ? 'certifications'
              : 'contact'
      toolArgs = { category }
      const portfolioTool = tools.find((t) => t.name === 'portfolio_query')
      if (portfolioTool) {
        toolResult = await portfolioTool.invoke(toolArgs)
      }
    } else {
      return { toolIterations, toolCallPending: null }
    }

    if (toolResult) {
      options.onToolCall?.(toolName, toolArgs)
    }

    const toolMessage = new ToolMessage({
      content: toolResult || 'Tool executed but returned no result.',
      tool_call_id: `${toolName}_${Date.now()}`,
    })

    return {
      messages: [toolMessage],
      toolIterations,
      toolCallPending: toolResult ? toolName : null,
      toolContext: toolResult,
    }
  }
}

function createChatGraph(options: ChatGraphOptions = {}) {
  const workflow = new StateGraph(GraphState)
    .addNode('loadContext', loadContextNode)
    .addNode('classifyIntent', classifyIntentNode)
    .addNode('retrieveContext', retrieveContextNode)
    .addNode('generate', createGenerateNode(options))
    .addNode('executeTool', createExecuteToolNode(options))
    .addEdge('__start__', 'loadContext')
    .addEdge('loadContext', 'classifyIntent')
    .addConditionalEdges(
      'classifyIntent',
      (state: GraphStateType) => {
        if (state.intent === 'tool_call') {
          return 'executeTool'
        }
        if (state.intent === 'rag_query') {
          return 'retrieveContext'
        }
        return 'generate'
      },
      {
        executeTool: 'executeTool',
        retrieveContext: 'retrieveContext',
        generate: 'generate',
      }
    )
    .addEdge('retrieveContext', 'generate')
    .addEdge('executeTool', 'generate')
    .addEdge('generate', '__end__')

  return workflow.compile()
}

let compiledGraph: ReturnType<typeof createChatGraph> | null = null

export function getCompiledGraph() {
  if (!compiledGraph) {
    compiledGraph = createChatGraph()
  }
  return compiledGraph
}

export async function runChatGraph(params: {
  message: string
  history: ConversationHistoryMessage[]
  threadId?: string
  onToken?: (token: string) => void
  onToolCall?: (name: string, args: Record<string, unknown>) => void
  onStatus?: (step: string) => void
}): Promise<{
  response: string
  threadId: string
  toolCalls: ToolCallResult[]
}> {
  const { message, history, threadId: inputThreadId, onToken, onToolCall, onStatus } = params
  const threadId = inputThreadId || `thread_${Date.now()}`

  onStatus?.('classifying')

  const graph =
    onToken || onToolCall ? createChatGraph({ onToken, onToolCall }) : getCompiledGraph()
  const savedState = loadCheckpoint(threadId)

  const initialState: Partial<GraphStateType> & { threadId: string } = {
    messages: [],
    threadId,
    userMessage: message,
    history,
    chatDataContext: (savedState?.chatDataContext as ChatDataContext | null) || null,
    toolIterations: 0,
    providerAttempts: [],
    ragContext: '',
    ragChunks: [],
    intent: 'general',
    systemPrompt: '',
    toolCallPending: null,
    toolContext: '',
  }

  let finalResponse = ''

  try {
    const finalState = await graph.invoke(initialState, {
      configurable: { thread_id: threadId },
    })

    const messages = finalState.messages as BaseMessage[]
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg instanceof AIMessage) {
        finalResponse =
          typeof lastMsg.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg.content)
      }
    }

    if (!finalResponse) {
      finalResponse = buildSmartFallback(
        message,
        finalState.chatDataContext as ChatDataContext,
        finalState.ragChunks as []
      )
    }

    saveCheckpoint(threadId, finalState as unknown as Record<string, unknown>)

    onStatus?.('done')

    return {
      response: finalResponse,
      threadId,
      toolCalls: [],
    }
  } catch (error) {
    onStatus?.('error')
    const fallbackContext = cmsContextCache || {
      profile: {} as Record<string, unknown>,
      experiences: [],
      projects: [],
      technologies: [],
      certifications: [],
      memberships: [],
      socials: [],
    }
    const fallbackResponse = buildSmartFallback(message, fallbackContext as ChatDataContext)
    onToken?.(fallbackResponse)
    return { response: fallbackResponse, threadId, toolCalls: [] }
  }
}
