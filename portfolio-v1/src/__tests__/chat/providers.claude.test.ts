import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type { SystemPromptParts } from '@/app/api/chat/lib/promptBuilder'
import type { ConversationHistoryMessage } from '@/app/api/chat/lib/types'

/* ------------------------------------------------------------------ *
 * Anthropic SDK double
 *
 * Hoisted so the vi.mock factory below can reach the same fn instances the
 * assertions use. The error classes mirror the real inheritance chain because
 * isTransientProviderError branches on `instanceof`.
 * ------------------------------------------------------------------ */

const sdk = vi.hoisted(() => {
  const create = vi.fn()
  const stream = vi.fn()
  const betaCreate = vi.fn()
  const betaStream = vi.fn()
  const constructorSpy = vi.fn()

  class APIError extends Error {
    status?: number

    constructor(message: string, status?: number) {
      super(message)
      this.name = 'APIError'
      this.status = status
    }
  }

  class RateLimitError extends APIError {}
  class APIConnectionError extends APIError {}
  class BadRequestError extends APIError {}

  return {
    create,
    stream,
    betaCreate,
    betaStream,
    constructorSpy,
    APIError,
    RateLimitError,
    APIConnectionError,
    BadRequestError,
  }
})

vi.mock('@anthropic-ai/sdk', () => {
  class MockAnthropic {
    messages = { create: sdk.create, stream: sdk.stream }
    beta = { messages: { create: sdk.betaCreate, stream: sdk.betaStream } }

    static APIError = sdk.APIError
    static RateLimitError = sdk.RateLimitError
    static APIConnectionError = sdk.APIConnectionError
    static BadRequestError = sdk.BadRequestError

    constructor(options: unknown) {
      sdk.constructorSpy(options)
    }
  }

  return { default: MockAnthropic }
})

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const PROMPT_PARTS: SystemPromptParts = {
  stable: 'STABLE CMS PROMPT',
  volatile: '=== RETRIEVED CONTEXT ===\nchunk\n=== END CONTEXT ===',
}

function textResponse(text: string) {
  return {
    stop_reason: 'end_turn',
    stop_details: null,
    content: [{ type: 'text', text }],
  }
}

function streamDouble(chunks: string[], final = textResponse(chunks.join(''))) {
  return {
    on: (event: string, listener: (text: string) => void) => {
      if (event === 'text') {
        chunks.forEach((chunk) => listener(chunk))
      }
      return undefined
    },
    finalMessage: async () => final,
  }
}

/**
 * Circuit-breaker state lives at module scope, so each test gets a fresh module
 * instance rather than inheriting failures from the previous one.
 */
async function loadProviders() {
  vi.resetModules()
  return import('@/app/api/chat/lib/providers')
}

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  vi.clearAllMocks()
  process.env = { ...ORIGINAL_ENV }
  process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'
  delete process.env.CLAUDE_MODEL
  delete process.env.CLAUDE_FALLBACK_MODEL
  delete process.env.CLAUDE_EFFORT
  delete process.env.CLAUDE_SPEED
  // Retries would multiply the SDK call counts these tests assert on.
  process.env.CHAT_PROVIDER_MAX_RETRIES = '0'
})

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
})

const NO_HISTORY: ConversationHistoryMessage[] = []

describe('generateWithClaude', () => {
  it('returns the assistant text with provider and model metadata', async () => {
    sdk.create.mockResolvedValue(textResponse('Keneth built a pharmacy system.'))

    const { generateWithClaude } = await loadProviders()
    const result = await generateWithClaude('Tell me about Keneth', NO_HISTORY, PROMPT_PARTS)

    expect(result.provider).toBe('claude')
    expect(result.model).toBe('claude-sonnet-5')
    expect(result.message).toBe('Keneth built a pharmacy system.')
    expect(result.attempts).toBe(1)
    expect(sdk.constructorSpy).toHaveBeenCalledWith({ apiKey: 'test-anthropic-key' })
  })

  it('never sends sampling parameters, which Sonnet 5 and Opus 5 reject with a 400', async () => {
    sdk.create.mockResolvedValue(textResponse('ok'))

    const { generateWithClaude } = await loadProviders()
    await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    const params = sdk.create.mock.calls[0][0]
    expect(params).not.toHaveProperty('temperature')
    expect(params).not.toHaveProperty('top_p')
    expect(params).not.toHaveProperty('top_k')
    expect(params).not.toHaveProperty('budget_tokens')
    expect(params.thinking).toEqual({ type: 'adaptive' })
  })

  it('marks only the stable prompt half as a cache breakpoint', async () => {
    sdk.create.mockResolvedValue(textResponse('ok'))

    const { generateWithClaude } = await loadProviders()
    await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    const { system } = sdk.create.mock.calls[0][0]
    expect(system).toHaveLength(2)
    expect(system[0]).toEqual({
      type: 'text',
      text: PROMPT_PARTS.stable,
      cache_control: { type: 'ephemeral' },
    })
    expect(system[1]).toEqual({ type: 'text', text: PROMPT_PARTS.volatile })
  })

  it('omits the volatile block entirely when no context was retrieved', async () => {
    sdk.create.mockResolvedValue(textResponse('ok'))

    const { generateWithClaude } = await loadProviders()
    await generateWithClaude('hi', NO_HISTORY, { stable: 'STABLE', volatile: '' })

    expect(sdk.create.mock.calls[0][0].system).toHaveLength(1)
  })

  it('reads effort from CLAUDE_EFFORT and falls back to medium on a bad value', async () => {
    sdk.create.mockResolvedValue(textResponse('ok'))

    process.env.CLAUDE_EFFORT = 'xhigh'
    const first = await loadProviders()
    await first.generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)
    expect(sdk.create.mock.calls[0][0].output_config).toEqual({ effort: 'xhigh' })

    sdk.create.mockClear()
    process.env.CLAUDE_EFFORT = 'turbo'
    const second = await loadProviders()
    await second.generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)
    expect(sdk.create.mock.calls[0][0].output_config).toEqual({ effort: 'medium' })
  })

  it('drops a leading assistant turn, which the Messages API rejects', async () => {
    sdk.create.mockResolvedValue(textResponse('ok'))

    const history: ConversationHistoryMessage[] = [
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'What projects?' },
    ]

    const { generateWithClaude } = await loadProviders()
    await generateWithClaude('and experience?', history, PROMPT_PARTS)

    const { messages } = sdk.create.mock.calls[0][0]
    expect(messages[0]).toEqual({ role: 'user', content: 'What projects?' })
    expect(messages[messages.length - 1]).toEqual({ role: 'user', content: 'and experience?' })
  })

  it('falls back to the secondary model when the primary fails', async () => {
    sdk.create
      .mockRejectedValueOnce(new sdk.BadRequestError('sonnet unavailable', 400))
      .mockResolvedValueOnce(textResponse('opus answered'))

    const { generateWithClaude } = await loadProviders()
    const result = await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    expect(sdk.create).toHaveBeenCalledTimes(2)
    expect(sdk.create.mock.calls[0][0].model).toBe('claude-sonnet-5')
    expect(sdk.create.mock.calls[1][0].model).toBe('claude-opus-5')
    expect(result.model).toBe('claude-opus-5')
    expect(result.message).toBe('opus answered')
  })

  it('honours CLAUDE_MODEL and CLAUDE_FALLBACK_MODEL overrides', async () => {
    process.env.CLAUDE_MODEL = 'claude-opus-5'
    process.env.CLAUDE_FALLBACK_MODEL = 'claude-opus-5'
    sdk.create.mockResolvedValue(textResponse('ok'))

    const { generateWithClaude } = await loadProviders()
    const result = await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    // A fallback identical to the primary is deduplicated, not retried twice.
    expect(sdk.create).toHaveBeenCalledTimes(1)
    expect(result.model).toBe('claude-opus-5')
  })

  it('treats a refusal as a provider failure rather than an answer', async () => {
    sdk.create.mockResolvedValue({
      stop_reason: 'refusal',
      stop_details: { type: 'refusal', category: 'cyber', explanation: 'declined' },
      content: [],
    })

    const { generateWithClaude } = await loadProviders()

    await expect(generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)).rejects.toThrow(
      /declined the request \(cyber\)/
    )
  })

  it('rejects an empty response instead of returning a blank message', async () => {
    sdk.create.mockResolvedValue(textResponse('   '))

    const { generateWithClaude } = await loadProviders()

    await expect(generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)).rejects.toThrow(
      /empty response/
    )
  })

  it('reports missing configuration without calling the API', async () => {
    delete process.env.ANTHROPIC_API_KEY

    const { generateWithClaude, ProviderUnavailableError } = await loadProviders()

    await expect(generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)).rejects.toBeInstanceOf(
      ProviderUnavailableError
    )
    expect(sdk.create).not.toHaveBeenCalled()
  })

  it('opens the circuit after repeated failures and then short-circuits', async () => {
    process.env.CHAT_PROVIDER_CIRCUIT_FAILURE_THRESHOLD = '2'
    sdk.create.mockRejectedValue(new sdk.BadRequestError('boom', 400))

    const { generateWithClaude, getProviderHealth } = await loadProviders()

    await expect(generateWithClaude('a', NO_HISTORY, PROMPT_PARTS)).rejects.toThrow()
    await expect(generateWithClaude('b', NO_HISTORY, PROMPT_PARTS)).rejects.toThrow()

    expect(getProviderHealth().providers.claude.circuitOpen).toBe(true)

    sdk.create.mockClear()
    await expect(generateWithClaude('c', NO_HISTORY, PROMPT_PARTS)).rejects.toThrow(
      /circuit is temporarily open/
    )
    expect(sdk.create).not.toHaveBeenCalled()
  })

  it('retries transient SDK errors but not client errors', async () => {
    process.env.CHAT_PROVIDER_MAX_RETRIES = '1'
    process.env.CHAT_PROVIDER_RETRY_BASE_MS = '1'
    process.env.CLAUDE_FALLBACK_MODEL = 'claude-sonnet-5'

    sdk.create
      .mockRejectedValueOnce(new sdk.RateLimitError('slow down', 429))
      .mockResolvedValueOnce(textResponse('recovered'))

    const { generateWithClaude } = await loadProviders()
    const result = await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result.message).toBe('recovered')
    expect(result.attempts).toBe(2)
  })
})

describe('Claude fast mode', () => {
  it('stays on the standard endpoint for a model that does not support it', async () => {
    process.env.CLAUDE_SPEED = 'fast'
    sdk.create.mockResolvedValue(textResponse('ok'))

    const { generateWithClaude } = await loadProviders()
    await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    expect(sdk.create).toHaveBeenCalledTimes(1)
    expect(sdk.betaCreate).not.toHaveBeenCalled()
  })

  it('routes through the beta endpoint with the speed flag on Opus 5', async () => {
    process.env.CLAUDE_SPEED = 'fast'
    process.env.CLAUDE_MODEL = 'claude-opus-5'
    sdk.betaCreate.mockResolvedValue(textResponse('fast answer'))

    const { generateWithClaude } = await loadProviders()
    const result = await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    expect(sdk.create).not.toHaveBeenCalled()
    const params = sdk.betaCreate.mock.calls[0][0]
    expect(params.speed).toBe('fast')
    expect(params.betas).toEqual(['fast-mode-2026-02-01'])
    expect(result.message).toBe('fast answer')
  })

  it('ignores CLAUDE_SPEED values other than fast', async () => {
    process.env.CLAUDE_SPEED = 'standard'
    process.env.CLAUDE_MODEL = 'claude-opus-5'
    sdk.create.mockResolvedValue(textResponse('ok'))

    const { generateWithClaude } = await loadProviders()
    await generateWithClaude('hi', NO_HISTORY, PROMPT_PARTS)

    expect(sdk.create).toHaveBeenCalledTimes(1)
    expect(sdk.betaCreate).not.toHaveBeenCalled()
  })
})

describe('streamWithClaude', () => {
  it('forwards every chunk and returns the accumulated text', async () => {
    sdk.stream.mockReturnValue(streamDouble(['Keneth ', 'builds ', 'systems.']))

    const onChunk = vi.fn()
    const { streamWithClaude } = await loadProviders()
    const result = await streamWithClaude('hi', NO_HISTORY, PROMPT_PARTS, { onChunk })

    expect(onChunk).toHaveBeenCalledTimes(3)
    expect(onChunk).toHaveBeenNthCalledWith(1, 'Keneth ')
    expect(result.message).toBe('Keneth builds systems.')
    expect(result.provider).toBe('claude')
  })

  it('does not retry after partial output, which would duplicate text in the UI', async () => {
    process.env.CHAT_PROVIDER_MAX_RETRIES = '2'
    process.env.CHAT_PROVIDER_RETRY_BASE_MS = '1'

    sdk.stream.mockReturnValue({
      on: (event: string, listener: (text: string) => void) => {
        if (event === 'text') {
          listener('partial')
        }
        return undefined
      },
      finalMessage: async () => {
        throw new sdk.APIConnectionError('connection reset', undefined)
      },
    })

    const onChunk = vi.fn()
    const { streamWithClaude } = await loadProviders()

    await expect(streamWithClaude('hi', NO_HISTORY, PROMPT_PARTS, { onChunk })).rejects.toThrow()
    expect(sdk.stream).toHaveBeenCalledTimes(1)
  })

  it('uses the beta stream endpoint when fast mode applies', async () => {
    process.env.CLAUDE_SPEED = 'fast'
    process.env.CLAUDE_MODEL = 'claude-opus-4-8'
    sdk.betaStream.mockReturnValue(streamDouble(['fast']))

    const { streamWithClaude } = await loadProviders()
    await streamWithClaude('hi', NO_HISTORY, PROMPT_PARTS, { onChunk: vi.fn() })

    expect(sdk.stream).not.toHaveBeenCalled()
    expect(sdk.betaStream.mock.calls[0][0].speed).toBe('fast')
  })
})
