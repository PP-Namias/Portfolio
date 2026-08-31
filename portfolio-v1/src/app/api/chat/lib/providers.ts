import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

import type { SystemPromptParts } from './promptBuilder'
import { ConversationHistoryMessage } from './types'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3-flash-preview']

function parseIntegerEnv(name: string, fallbackValue: number, minimum = 0): number {
  const rawValue = process.env[name]
  const parsedValue = Number.parseInt(rawValue || '', 10)

  if (!Number.isFinite(parsedValue) || parsedValue < minimum) {
    return fallbackValue
  }

  return parsedValue
}

function getProviderTimeoutMs(): number {
  return parseIntegerEnv('CHAT_PROVIDER_TIMEOUT_MS', 12_000, 1)
}

function getProviderMaxRetries(): number {
  return parseIntegerEnv('CHAT_PROVIDER_MAX_RETRIES', 1, 0)
}

function getProviderRetryBaseMs(): number {
  return parseIntegerEnv('CHAT_PROVIDER_RETRY_BASE_MS', 220, 1)
}

function getCircuitFailureThreshold(): number {
  return parseIntegerEnv('CHAT_PROVIDER_CIRCUIT_FAILURE_THRESHOLD', 4, 1)
}

function getCircuitCooldownMs(): number {
  return parseIntegerEnv('CHAT_PROVIDER_CIRCUIT_COOLDOWN_MS', 60_000, 1)
}

function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini'
}

function getOpenAiBaseUrl(): string {
  const raw = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
  try {
    const parsed = new URL(raw)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error(`Invalid protocol: ${parsed.protocol}`)
    }
    return raw
  } catch {
    return 'https://api.openai.com/v1'
  }
}

// Anthropic ships no embeddings API, so RAG retrieval stays on Gemini
// (src/lib/rag/embedder.ts). Claude is a generation provider only.
const CLAUDE_DEFAULT_MODEL = 'claude-sonnet-5'
const CLAUDE_DEFAULT_FALLBACK_MODEL = 'claude-opus-5'
const CLAUDE_MAX_OUTPUT_TOKENS = 2048

// Fast mode is a research preview limited to these models on the first-party
// API. Requesting it anywhere else is an error, so the flag is ignored there.
const CLAUDE_FAST_MODE_MODELS = new Set(['claude-opus-5', 'claude-opus-4-8'])
const CLAUDE_FAST_MODE_BETA = 'fast-mode-2026-02-01'

type ClaudeEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'max'

const CLAUDE_EFFORT_LEVELS = new Set<ClaudeEffort>(['low', 'medium', 'high', 'xhigh', 'max'])

function getClaudeModels(): string[] {
  const primary = process.env.CLAUDE_MODEL?.trim() || CLAUDE_DEFAULT_MODEL
  const fallback = process.env.CLAUDE_FALLBACK_MODEL?.trim() || CLAUDE_DEFAULT_FALLBACK_MODEL

  return fallback && fallback !== primary ? [primary, fallback] : [primary]
}

function getClaudeEffort(): ClaudeEffort {
  const raw = (process.env.CLAUDE_EFFORT || '').trim().toLowerCase() as ClaudeEffort
  return CLAUDE_EFFORT_LEVELS.has(raw) ? raw : 'medium'
}

function isClaudeFastModeEnabled(model: string): boolean {
  const requested = (process.env.CLAUDE_SPEED || '').trim().toLowerCase() === 'fast'
  return requested && CLAUDE_FAST_MODE_MODELS.has(model)
}

type ProviderName = 'claude' | 'gemini' | 'openai'

type CircuitState = {
  failures: number
  openedAt: number | null
}

const providerCircuitState: Record<ProviderName, CircuitState> = {
  claude: { failures: 0, openedAt: null },
  gemini: { failures: 0, openedAt: null },
  openai: { failures: 0, openedAt: null },
}

interface ProviderGenerationResult {
  provider: ProviderName
  model: string
  message: string
  attempts: number
  latencyMs: number
}

export interface StreamingResult {
  message: string
  model: string
  provider: ProviderName
  latencyMs: number
}

interface StreamingChunkHandler {
  onChunk: (text: string) => void
}

interface ProviderHealth {
  configured: boolean
  circuitOpen: boolean
}

interface ChatProviderHealth {
  status: 'active' | 'inactive'
  providers: Record<ProviderName, ProviderHealth>
  multiProviderEnabled: boolean
  order: ProviderName[]
}

class ProviderUnavailableError extends Error {
  reason: 'missing_config' | 'circuit_open'
  provider: ProviderName

  constructor(provider: ProviderName, reason: 'missing_config' | 'circuit_open', message: string) {
    super(message)
    this.name = 'ProviderUnavailableError'
    this.provider = provider
    this.reason = reason
  }
}

class ProviderTimeoutError extends Error {
  providerLabel: string

  constructor(providerLabel: string, timeoutMs: number) {
    super(`${providerLabel} timed out after ${timeoutMs}ms.`)
    this.name = 'ProviderTimeoutError'
    this.providerLabel = providerLabel
  }
}

function isMultiProviderEnabled(): boolean {
  const value = (process.env.CHAT_MULTI_PROVIDER_ENABLED || '').toLowerCase()
  return value === '1' || value === 'true' || value === 'yes' || value === 'on'
}

function isConfigured(provider: ProviderName): boolean {
  if (provider === 'claude') {
    return Boolean(process.env.ANTHROPIC_API_KEY)
  }

  if (provider === 'gemini') {
    return Boolean(process.env.GOOGLE_GEMINI_API_KEY)
  }

  return Boolean(process.env.OPENAI_API_KEY)
}

function getCircuitState(provider: ProviderName): CircuitState {
  return providerCircuitState[provider]
}

function isCircuitOpen(provider: ProviderName): boolean {
  const state = getCircuitState(provider)

  if (!state.openedAt) {
    return false
  }

  const isCoolingDown = Date.now() - state.openedAt < getCircuitCooldownMs()

  if (isCoolingDown) {
    return true
  }

  state.failures = 0
  state.openedAt = null
  return false
}

function markProviderSuccess(provider: ProviderName): void {
  const state = getCircuitState(provider)
  state.failures = 0
  state.openedAt = null
}

function markProviderFailure(provider: ProviderName): void {
  const state = getCircuitState(provider)
  state.failures += 1

  if (state.failures >= getCircuitFailureThreshold()) {
    state.openedAt = Date.now()
  }
}

function describeProviderHealth(provider: ProviderName): ProviderHealth {
  const configured = isConfigured(provider)

  return {
    configured,
    circuitOpen: configured && isCircuitOpen(provider),
  }
}

function getProviderHealth(): ChatProviderHealth {
  const multiProviderEnabled = isMultiProviderEnabled()
  const order = getProviderOrder()

  const providers: Record<ProviderName, ProviderHealth> = {
    claude: describeProviderHealth('claude'),
    gemini: describeProviderHealth('gemini'),
    openai: describeProviderHealth('openai'),
  }

  // OpenAI stays gated behind CHAT_MULTI_PROVIDER_ENABLED for backward
  // compatibility; Claude and Gemini need only a key and a closed circuit.
  const anyHealthy = order.some((provider) => {
    if (provider === 'openai' && !multiProviderEnabled) {
      return false
    }

    const health = providers[provider]
    return health.configured && !health.circuitOpen
  })

  return {
    status: anyHealthy ? 'active' : 'inactive',
    multiProviderEnabled,
    order,
    providers,
  }
}

function mapHistoryForGemini(history: ConversationHistoryMessage[]) {
  return history.slice(-10).map((item) => ({
    role: item.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: item.content }],
  }))
}

function mapHistoryForClaude(history: ConversationHistoryMessage[]): Anthropic.MessageParam[] {
  const recent: Anthropic.MessageParam[] = history.slice(-10).map((item) => ({
    role: item.role === 'assistant' ? ('assistant' as const) : ('user' as const),
    content: item.content,
  }))

  // The Messages API rejects a history that opens on an assistant turn.
  while (recent.length > 0 && recent[0].role === 'assistant') {
    recent.shift()
  }

  return recent
}

function mapHistoryForOpenAI(history: ConversationHistoryMessage[]) {
  return history.slice(-10).map((item) => ({
    role: item.role === 'assistant' ? 'assistant' : 'user',
    content: item.content,
  }))
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  try {
    return JSON.stringify(error)
  } catch {
    return 'unknown_error'
  }
}

function isTransientProviderError(error: unknown): boolean {
  // The Anthropic SDK raises typed errors, so classify those precisely rather
  // than relying on the substring heuristics used for the other providers.
  if (error instanceof Anthropic.APIConnectionError || error instanceof Anthropic.RateLimitError) {
    return true
  }

  if (error instanceof Anthropic.APIError) {
    return typeof error.status === 'number' && error.status >= 500
  }

  const message = normalizeErrorMessage(error).toLowerCase()

  return [
    'timeout',
    'timed out',
    'network',
    'fetch failed',
    'rate limit',
    'quota',
    '429',
    '500',
    '502',
    '503',
    '504',
    'temporarily unavailable',
    'connection reset',
    'econn',
  ].some((token) => message.includes(token))
}

function computeRetryDelayMs(attempt: number): number {
  const retryBaseMs = getProviderRetryBaseMs()
  const exponential = retryBaseMs * Math.pow(2, Math.max(0, attempt - 1))
  const jitter = Math.floor(Math.random() * Math.max(20, retryBaseMs * 0.35))
  return exponential + jitter
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function executeWithRetry<T>(
  operation: (attempt: number) => Promise<T>
): Promise<{ value: T; attempts: number }> {
  const maxAttempts = Math.max(1, getProviderMaxRetries() + 1)
  let lastError: unknown = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const value = await operation(attempt)
      return { value, attempts: attempt }
    } catch (error) {
      lastError = error

      if (attempt >= maxAttempts || !isTransientProviderError(error)) {
        throw error
      }

      await sleep(computeRetryDelayMs(attempt))
    }
  }

  throw lastError
}

async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  providerLabel: string
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      operation(),
      new Promise<T>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new ProviderTimeoutError(providerLabel, timeoutMs))
        }, timeoutMs)
      }),
    ])
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
    }
  }
}

function createClaudeClient(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY as string })
}

function buildClaudeSystemBlocks(promptParts: SystemPromptParts): Anthropic.TextBlockParam[] {
  // The stable half is byte-identical on every request, so marking it as the
  // cache breakpoint lets Anthropic serve the whole CMS payload from cache.
  // The retrieved RAG context varies per query and must follow the breakpoint.
  const blocks: Anthropic.TextBlockParam[] = [
    {
      type: 'text',
      text: promptParts.stable,
      cache_control: { type: 'ephemeral' },
    },
  ]

  if (promptParts.volatile) {
    blocks.push({ type: 'text', text: promptParts.volatile })
  }

  return blocks
}

function buildClaudeRequestParams(
  model: string,
  message: string,
  history: ConversationHistoryMessage[],
  promptParts: SystemPromptParts
) {
  // No temperature/top_p/top_k here: those parameters are rejected with a 400
  // on Sonnet 5 and Opus 5. Response depth is controlled by effort instead.
  return {
    model,
    max_tokens: CLAUDE_MAX_OUTPUT_TOKENS,
    system: buildClaudeSystemBlocks(promptParts),
    messages: [...mapHistoryForClaude(history), { role: 'user' as const, content: message }],
    thinking: { type: 'adaptive' as const },
    output_config: { effort: getClaudeEffort() },
  }
}

function extractClaudeText(response: Anthropic.Message): string {
  if (response.stop_reason === 'refusal') {
    const category = response.stop_details?.category ?? 'unspecified'
    throw new Error(`Claude declined the request (${category}).`)
  }

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim()

  if (!text) {
    throw new Error('Claude returned an empty response.')
  }

  return text
}

async function tryClaudeModel(
  client: Anthropic,
  model: string,
  message: string,
  history: ConversationHistoryMessage[],
  promptParts: SystemPromptParts
): Promise<string> {
  const params = buildClaudeRequestParams(model, message, history, promptParts)

  const response = isClaudeFastModeEnabled(model)
    ? await client.beta.messages.create({
        ...params,
        speed: 'fast',
        betas: [CLAUDE_FAST_MODE_BETA],
      })
    : await client.messages.create(params)

  return extractClaudeText(response as Anthropic.Message)
}

async function generateWithClaude(
  message: string,
  history: ConversationHistoryMessage[],
  promptParts: SystemPromptParts
): Promise<ProviderGenerationResult> {
  if (!isConfigured('claude')) {
    throw new ProviderUnavailableError(
      'claude',
      'missing_config',
      'Anthropic API key is not configured.'
    )
  }

  if (isCircuitOpen('claude')) {
    throw new ProviderUnavailableError(
      'claude',
      'circuit_open',
      'Claude circuit is temporarily open.'
    )
  }

  const client = createClaudeClient()
  const timeoutMs = getProviderTimeoutMs()

  const providerStartedAt = Date.now()
  let lastError: unknown = null

  try {
    for (const modelName of getClaudeModels()) {
      try {
        const { value, attempts } = await executeWithRetry((attempt) =>
          withTimeout(
            () => tryClaudeModel(client, modelName, message, history, promptParts),
            timeoutMs,
            `claude:${modelName}:attempt-${attempt}`
          )
        )

        markProviderSuccess('claude')

        return {
          provider: 'claude',
          model: modelName,
          message: value,
          attempts,
          latencyMs: Date.now() - providerStartedAt,
        }
      } catch (error) {
        lastError = error
      }
    }

    throw lastError || new Error('Claude failed across all configured models.')
  } catch (error) {
    markProviderFailure('claude')
    throw error
  }
}

/**
 * The standard and beta stream helpers are structurally identical but are
 * distinct nominal types, so a union of the two makes `.on()` uncallable.
 * Accepting the shape we actually use keeps both branches type-safe.
 */
interface ClaudeTextStream {
  on(event: 'text', listener: (text: string) => void): unknown
  finalMessage(): Promise<unknown>
}

async function consumeClaudeStream(
  stream: ClaudeTextStream,
  onChunk: (text: string) => void
): Promise<Anthropic.Message> {
  stream.on('text', (text) => {
    if (text) {
      onChunk(text)
    }
  })

  return (await stream.finalMessage()) as Anthropic.Message
}

async function tryClaudeModelStream(
  client: Anthropic,
  model: string,
  message: string,
  history: ConversationHistoryMessage[],
  promptParts: SystemPromptParts,
  onChunk: (text: string) => void
): Promise<string> {
  const params = buildClaudeRequestParams(model, message, history, promptParts)

  const stream: ClaudeTextStream = isClaudeFastModeEnabled(model)
    ? client.beta.messages.stream({
        ...params,
        speed: 'fast',
        betas: [CLAUDE_FAST_MODE_BETA],
      })
    : client.messages.stream(params)

  return extractClaudeText(await consumeClaudeStream(stream, onChunk))
}

async function streamWithClaude(
  message: string,
  history: ConversationHistoryMessage[],
  promptParts: SystemPromptParts,
  handlers: StreamingChunkHandler
): Promise<StreamingResult> {
  if (!isConfigured('claude')) {
    throw new ProviderUnavailableError(
      'claude',
      'missing_config',
      'Anthropic API key is not configured.'
    )
  }

  if (isCircuitOpen('claude')) {
    throw new ProviderUnavailableError(
      'claude',
      'circuit_open',
      'Claude circuit is temporarily open.'
    )
  }

  const client = createClaudeClient()
  const timeoutMs = getProviderTimeoutMs()

  const providerStartedAt = Date.now()
  let lastError: unknown = null

  try {
    for (const modelName of getClaudeModels()) {
      let streamedAnyChunk = false

      try {
        const { value: fullText } = await executeWithRetry(async (attempt) => {
          try {
            return await withTimeout(
              () =>
                tryClaudeModelStream(client, modelName, message, history, promptParts, (chunk) => {
                  streamedAnyChunk = true
                  handlers.onChunk(chunk)
                }),
              timeoutMs,
              `claude:${modelName}:attempt-${attempt}`
            )
          } catch (error) {
            // Retrying after partial output would duplicate text in the UI.
            if (streamedAnyChunk) {
              throw new Error('Claude stream interrupted after partial output.')
            }
            throw error
          }
        })

        markProviderSuccess('claude')

        return {
          provider: 'claude',
          model: modelName,
          message: fullText,
          latencyMs: Date.now() - providerStartedAt,
        }
      } catch (error) {
        lastError = error
        if (streamedAnyChunk) break
      }
    }

    throw lastError || new Error('Claude streaming failed across all configured models.')
  } catch (error) {
    markProviderFailure('claude')
    throw error
  }
}

async function tryGeminiModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.6,
      topP: 0.85,
      maxOutputTokens: 1024,
    },
  })

  const chat = model.startChat({
    history: mapHistoryForGemini(history),
  })

  const result = await chat.sendMessage(message)
  const response = result.response.text().trim()

  if (!response) {
    throw new Error('Gemini returned an empty response.')
  }

  return response
}

async function generateWithGemini(
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string
): Promise<ProviderGenerationResult> {
  if (!isConfigured('gemini')) {
    throw new ProviderUnavailableError(
      'gemini',
      'missing_config',
      'Gemini API key is not configured.'
    )
  }

  if (isCircuitOpen('gemini')) {
    throw new ProviderUnavailableError(
      'gemini',
      'circuit_open',
      'Gemini circuit is temporarily open.'
    )
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY as string
  const genAI = new GoogleGenerativeAI(apiKey)
  const timeoutMs = getProviderTimeoutMs()

  const providerStartedAt = Date.now()
  let lastError: unknown = null

  try {
    for (const modelName of GEMINI_MODELS) {
      try {
        const { value, attempts } = await executeWithRetry((attempt) =>
          withTimeout(
            () => tryGeminiModel(genAI, modelName, message, history, systemPrompt),
            timeoutMs,
            `gemini:${modelName}:attempt-${attempt}`
          )
        )

        markProviderSuccess('gemini')

        return {
          provider: 'gemini',
          model: modelName,
          message: value,
          attempts,
          latencyMs: Date.now() - providerStartedAt,
        }
      } catch (error) {
        lastError = error
      }
    }

    throw lastError || new Error('Gemini failed across all configured models.')
  } catch (error) {
    markProviderFailure('gemini')
    throw error
  }
}

async function requestOpenAIChatCompletion(
  model: string,
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string,
  attempt: number
): Promise<string> {
  const timeoutMs = getProviderTimeoutMs()
  const controller = new AbortController()
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${getOpenAiBaseUrl()}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        top_p: 0.85,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...mapHistoryForOpenAI(history),
          { role: 'user', content: message },
        ],
      }),
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `OpenAI request failed (${response.status}): ${errorBody.slice(0, 220) || response.statusText}`
      )
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>
    }

    const content = payload.choices?.[0]?.message?.content?.trim()

    if (!content) {
      throw new Error('OpenAI returned an empty response.')
    }

    return content
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ProviderTimeoutError(`openai:${model}:attempt-${attempt}`, timeoutMs)
    }

    throw error
  } finally {
    clearTimeout(timeoutHandle)
  }
}

async function tryGeminiModelStream(
  genAI: GoogleGenerativeAI,
  modelName: string,
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.6,
      topP: 0.85,
      maxOutputTokens: 1024,
    },
  })

  const chat = model.startChat({
    history: mapHistoryForGemini(history),
  })

  const result = await chat.sendMessageStream(message)
  let fullText = ''

  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) {
      fullText += text
      onChunk(text)
    }
  }

  const response = fullText.trim()

  if (!response) {
    throw new Error('Gemini stream returned an empty response.')
  }

  return response
}

async function streamWithGemini(
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string,
  handlers: StreamingChunkHandler
): Promise<StreamingResult> {
  if (!isConfigured('gemini')) {
    throw new ProviderUnavailableError(
      'gemini',
      'missing_config',
      'Gemini API key is not configured.'
    )
  }

  if (isCircuitOpen('gemini')) {
    throw new ProviderUnavailableError(
      'gemini',
      'circuit_open',
      'Gemini circuit is temporarily open.'
    )
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY as string
  const genAI = new GoogleGenerativeAI(apiKey)
  const timeoutMs = getProviderTimeoutMs()

  const providerStartedAt = Date.now()
  let lastError: unknown = null

  try {
    for (const modelName of GEMINI_MODELS) {
      let streamedAnyChunk = false

      try {
        const { value: fullText } = await executeWithRetry(async (attempt) => {
          try {
            return await withTimeout(
              async () => {
                const text = await tryGeminiModelStream(
                  genAI,
                  modelName,
                  message,
                  history,
                  systemPrompt,
                  (chunk) => {
                    streamedAnyChunk = true
                    handlers.onChunk(chunk)
                  }
                )
                return text
              },
              timeoutMs,
              `gemini:${modelName}:attempt-${attempt}`
            )
          } catch (error) {
            if (streamedAnyChunk) {
              throw new Error('Gemini stream interrupted after partial output.')
            }
            throw error
          }
        })

        markProviderSuccess('gemini')

        return {
          provider: 'gemini',
          model: modelName,
          message: fullText,
          latencyMs: Date.now() - providerStartedAt,
        }
      } catch (error) {
        lastError = error
        if (streamedAnyChunk) break
      }
    }

    throw lastError || new Error('Gemini streaming failed across all configured models.')
  } catch (error) {
    markProviderFailure('gemini')
    throw error
  }
}

async function generateWithOpenAI(
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string
): Promise<ProviderGenerationResult> {
  if (!isConfigured('openai')) {
    throw new ProviderUnavailableError(
      'openai',
      'missing_config',
      'OpenAI API key is not configured.'
    )
  }

  if (isCircuitOpen('openai')) {
    throw new ProviderUnavailableError(
      'openai',
      'circuit_open',
      'OpenAI circuit is temporarily open.'
    )
  }

  const model = getOpenAiModel()
  const providerStartedAt = Date.now()

  try {
    const { value, attempts } = await executeWithRetry((attempt) =>
      requestOpenAIChatCompletion(model, message, history, systemPrompt, attempt)
    )

    markProviderSuccess('openai')

    return {
      provider: 'openai',
      model,
      message: value,
      attempts,
      latencyMs: Date.now() - providerStartedAt,
    }
  } catch (error) {
    markProviderFailure('openai')
    throw error
  }
}

const DEFAULT_PROVIDER_ORDER: ProviderName[] = ['claude', 'gemini', 'openai']
const KNOWN_PROVIDERS = new Set<string>(DEFAULT_PROVIDER_ORDER)

/**
 * Resolve the failover order from CHAT_PROVIDER_ORDER, e.g. "claude,gemini".
 * Unknown names are dropped; an empty or fully-invalid value falls back to the
 * default. This is what makes "which provider is primary" a config decision
 * rather than a code change.
 */
function getProviderOrder(): ProviderName[] {
  const raw = (process.env.CHAT_PROVIDER_ORDER || '').trim()

  if (!raw) {
    return [...DEFAULT_PROVIDER_ORDER]
  }

  const parsed = raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry): entry is ProviderName => KNOWN_PROVIDERS.has(entry))

  const deduplicated = [...new Set(parsed)]

  return deduplicated.length > 0 ? deduplicated : [...DEFAULT_PROVIDER_ORDER]
}

type ProviderSkipReason = 'disabled' | 'missing_config' | 'circuit_open' | 'streaming_unsupported'

function getProviderSkipReason(provider: ProviderName): ProviderSkipReason | null {
  if (provider === 'openai' && !isMultiProviderEnabled()) {
    return 'disabled'
  }

  if (!isConfigured(provider)) {
    return 'missing_config'
  }

  if (isCircuitOpen(provider)) {
    return 'circuit_open'
  }

  return null
}

interface ProviderChainOutcome<TResult> {
  result: TResult | null
  attempts: Array<Record<string, unknown>>
}

function flattenPrompt(promptParts: SystemPromptParts): string {
  return `${promptParts.stable}${promptParts.volatile}`
}

/**
 * Walk the configured providers in order and return the first success, along
 * with a per-provider attempt log for structured logging.
 */
async function generateWithProviderChain(
  message: string,
  history: ConversationHistoryMessage[],
  promptParts: SystemPromptParts
): Promise<ProviderChainOutcome<ProviderGenerationResult>> {
  const attempts: Array<Record<string, unknown>> = []

  for (const provider of getProviderOrder()) {
    const skipReason = getProviderSkipReason(provider)

    if (skipReason) {
      attempts.push({ provider, result: 'skipped', reason: skipReason })
      continue
    }

    try {
      const result =
        provider === 'claude'
          ? await generateWithClaude(message, history, promptParts)
          : provider === 'gemini'
            ? await generateWithGemini(message, history, flattenPrompt(promptParts))
            : await generateWithOpenAI(message, history, flattenPrompt(promptParts))

      attempts.push({
        provider: result.provider,
        model: result.model,
        attempts: result.attempts,
        latencyMs: result.latencyMs,
        result: 'success',
      })

      return { result, attempts }
    } catch (error) {
      attempts.push({
        provider,
        result: 'error',
        errorClass: classifyProviderError(error),
      })
    }
  }

  return { result: null, attempts }
}

/**
 * Streaming counterpart. OpenAI has no streaming implementation here, so it is
 * recorded as unsupported and skipped rather than silently dropped.
 */
async function streamWithProviderChain(
  message: string,
  history: ConversationHistoryMessage[],
  promptParts: SystemPromptParts,
  handlers: StreamingChunkHandler
): Promise<ProviderChainOutcome<StreamingResult>> {
  const attempts: Array<Record<string, unknown>> = []

  for (const provider of getProviderOrder()) {
    if (provider === 'openai') {
      attempts.push({ provider, result: 'skipped', reason: 'streaming_unsupported' })
      continue
    }

    const skipReason = getProviderSkipReason(provider)

    if (skipReason) {
      attempts.push({ provider, result: 'skipped', reason: skipReason })
      continue
    }

    try {
      const result =
        provider === 'claude'
          ? await streamWithClaude(message, history, promptParts, handlers)
          : await streamWithGemini(message, history, flattenPrompt(promptParts), handlers)

      attempts.push({
        provider: result.provider,
        model: result.model,
        latencyMs: result.latencyMs,
        result: 'success',
      })

      return { result, attempts }
    } catch (error) {
      attempts.push({
        provider,
        result: 'error',
        errorClass: classifyProviderError(error),
      })
    }
  }

  return { result: null, attempts }
}

function classifyProviderError(error: unknown): string {
  if (error instanceof ProviderUnavailableError) {
    return `provider_unavailable:${error.provider}:${error.reason}`
  }

  if (error instanceof ProviderTimeoutError) {
    return `provider_timeout:${error.providerLabel}`
  }

  if (error instanceof Error) {
    return `provider_error:${error.name.toLowerCase()}`
  }

  return 'provider_error:unknown'
}

export {
  classifyProviderError,
  generateWithClaude,
  generateWithGemini,
  generateWithOpenAI,
  generateWithProviderChain,
  getProviderHealth,
  getProviderOrder,
  isMultiProviderEnabled,
  streamWithClaude,
  streamWithGemini,
  streamWithProviderChain,
  ProviderUnavailableError,
}
export type { ChatProviderHealth, ProviderChainOutcome, ProviderGenerationResult, ProviderName }
