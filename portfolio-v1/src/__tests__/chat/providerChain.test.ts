import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type { SystemPromptParts } from '@/app/api/chat/lib/promptBuilder'
import type { ConversationHistoryMessage } from '@/app/api/chat/lib/types'

/* ------------------------------------------------------------------ *
 * Provider doubles
 *
 * These tests drive the real chain over stubbed SDKs so the failover order,
 * skip reasons, and attempt log are exercised end to end.
 * ------------------------------------------------------------------ */

const sdk = vi.hoisted(() => {
  const claudeCreate = vi.fn()
  const claudeStream = vi.fn()
  const geminiSendMessage = vi.fn()
  const geminiSendMessageStream = vi.fn()

  class APIError extends Error {
    status?: number

    constructor(message: string, status?: number) {
      super(message)
      this.status = status
    }
  }

  return {
    claudeCreate,
    claudeStream,
    geminiSendMessage,
    geminiSendMessageStream,
    APIError,
    RateLimitError: class extends APIError {},
    APIConnectionError: class extends APIError {},
  }
})

vi.mock('@anthropic-ai/sdk', () => {
  class MockAnthropic {
    messages = { create: sdk.claudeCreate, stream: sdk.claudeStream }
    beta = { messages: { create: vi.fn(), stream: vi.fn() } }

    static APIError = sdk.APIError
    static RateLimitError = sdk.RateLimitError
    static APIConnectionError = sdk.APIConnectionError
  }

  return { default: MockAnthropic }
})

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        startChat: () => ({
          sendMessage: sdk.geminiSendMessage,
          sendMessageStream: sdk.geminiSendMessageStream,
        }),
      }
    }
  },
}))

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const PROMPT_PARTS: SystemPromptParts = { stable: 'STABLE', volatile: 'VOLATILE' }
const NO_HISTORY: ConversationHistoryMessage[] = []

function claudeText(text: string) {
  return { stop_reason: 'end_turn', stop_details: null, content: [{ type: 'text', text }] }
}

function geminiText(text: string) {
  return { response: { text: () => text } }
}

function openAiResponse(text: string) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({ choices: [{ message: { content: text } }] }),
    text: async () => '',
  }
}

async function loadProviders() {
  vi.resetModules()
  return import('@/app/api/chat/lib/providers')
}

const ORIGINAL_ENV = { ...process.env }
const ORIGINAL_FETCH = globalThis.fetch

beforeEach(() => {
  vi.clearAllMocks()
  process.env = { ...ORIGINAL_ENV }
  process.env.ANTHROPIC_API_KEY = 'anthropic-key'
  process.env.GOOGLE_GEMINI_API_KEY = 'gemini-key'
  delete process.env.OPENAI_API_KEY
  delete process.env.CHAT_PROVIDER_ORDER
  delete process.env.CHAT_MULTI_PROVIDER_ENABLED
  process.env.CHAT_PROVIDER_MAX_RETRIES = '0'
})

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  globalThis.fetch = ORIGINAL_FETCH
})

describe('getProviderOrder', () => {
  it('defaults to Claude first, then Gemini, then OpenAI', async () => {
    const { getProviderOrder } = await loadProviders()
    expect(getProviderOrder()).toEqual(['claude', 'gemini', 'openai'])
  })

  it('honours CHAT_PROVIDER_ORDER', async () => {
    process.env.CHAT_PROVIDER_ORDER = 'gemini, claude'
    const { getProviderOrder } = await loadProviders()
    expect(getProviderOrder()).toEqual(['gemini', 'claude'])
  })

  it('drops unknown providers and deduplicates', async () => {
    process.env.CHAT_PROVIDER_ORDER = 'claude,mistral,claude,gemini'
    const { getProviderOrder } = await loadProviders()
    expect(getProviderOrder()).toEqual(['claude', 'gemini'])
  })

  it('falls back to the default when the value is empty or entirely invalid', async () => {
    process.env.CHAT_PROVIDER_ORDER = 'llama,mistral'
    const { getProviderOrder } = await loadProviders()
    expect(getProviderOrder()).toEqual(['claude', 'gemini', 'openai'])
  })
})

describe('generateWithProviderChain', () => {
  it('returns the first provider in the order that succeeds', async () => {
    sdk.claudeCreate.mockResolvedValue(claudeText('claude answer'))

    const { generateWithProviderChain } = await loadProviders()
    const { result, attempts } = await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result?.provider).toBe('claude')
    expect(result?.message).toBe('claude answer')
    expect(sdk.geminiSendMessage).not.toHaveBeenCalled()
    expect(attempts).toEqual([expect.objectContaining({ provider: 'claude', result: 'success' })])
  })

  it('falls through to Gemini when Claude fails, and logs both attempts', async () => {
    sdk.claudeCreate.mockRejectedValue(new sdk.APIError('claude down', 400))
    sdk.geminiSendMessage.mockResolvedValue(geminiText('gemini answer'))

    const { generateWithProviderChain } = await loadProviders()
    const { result, attempts } = await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result?.provider).toBe('gemini')
    expect(result?.message).toBe('gemini answer')
    expect(attempts[0]).toMatchObject({ provider: 'claude', result: 'error' })
    expect(attempts[1]).toMatchObject({ provider: 'gemini', result: 'success' })
  })

  it('passes the flattened prompt to Gemini and the split prompt to Claude', async () => {
    sdk.claudeCreate.mockRejectedValue(new sdk.APIError('nope', 400))
    sdk.geminiSendMessage.mockResolvedValue(geminiText('ok'))

    const { generateWithProviderChain } = await loadProviders()
    await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    // Claude receives two system blocks; Gemini receives one concatenated string.
    expect(sdk.claudeCreate.mock.calls[0][0].system).toHaveLength(2)
    expect(sdk.geminiSendMessage).toHaveBeenCalledWith('hi')
  })

  it('skips providers with no key and records why', async () => {
    delete process.env.ANTHROPIC_API_KEY
    sdk.geminiSendMessage.mockResolvedValue(geminiText('gemini answer'))

    const { generateWithProviderChain } = await loadProviders()
    const { result, attempts } = await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result?.provider).toBe('gemini')
    expect(attempts[0]).toEqual({ provider: 'claude', result: 'skipped', reason: 'missing_config' })
    expect(sdk.claudeCreate).not.toHaveBeenCalled()
  })

  it('keeps OpenAI gated behind CHAT_MULTI_PROVIDER_ENABLED', async () => {
    process.env.OPENAI_API_KEY = 'openai-key'
    sdk.claudeCreate.mockRejectedValue(new sdk.APIError('down', 400))
    sdk.geminiSendMessage.mockRejectedValue(new Error('down'))
    globalThis.fetch = vi.fn()

    const { generateWithProviderChain } = await loadProviders()
    const { result, attempts } = await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result).toBeNull()
    expect(attempts[2]).toEqual({ provider: 'openai', result: 'skipped', reason: 'disabled' })
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('reaches OpenAI as the last tier when the flag is on', async () => {
    process.env.OPENAI_API_KEY = 'openai-key'
    process.env.CHAT_MULTI_PROVIDER_ENABLED = 'true'
    sdk.claudeCreate.mockRejectedValue(new sdk.APIError('down', 400))
    sdk.geminiSendMessage.mockRejectedValue(new Error('down'))
    globalThis.fetch = vi.fn().mockResolvedValue(openAiResponse('openai answer'))

    const { generateWithProviderChain } = await loadProviders()
    const { result } = await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result?.provider).toBe('openai')
    expect(result?.message).toBe('openai answer')
  })

  it('returns a null result when every provider fails, leaving the caller to fall back', async () => {
    sdk.claudeCreate.mockRejectedValue(new sdk.APIError('down', 400))
    sdk.geminiSendMessage.mockRejectedValue(new Error('down'))

    const { generateWithProviderChain } = await loadProviders()
    const { result, attempts } = await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result).toBeNull()
    expect(attempts).toHaveLength(3)
  })

  it('respects a custom order that puts Gemini first', async () => {
    process.env.CHAT_PROVIDER_ORDER = 'gemini,claude'
    sdk.geminiSendMessage.mockResolvedValue(geminiText('gemini first'))

    const { generateWithProviderChain } = await loadProviders()
    const { result } = await generateWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS)

    expect(result?.provider).toBe('gemini')
    expect(sdk.claudeCreate).not.toHaveBeenCalled()
  })
})

describe('streamWithProviderChain', () => {
  it('streams from Claude when it is first and healthy', async () => {
    sdk.claudeStream.mockReturnValue({
      on: (event: string, listener: (text: string) => void) => {
        if (event === 'text') {
          listener('a')
          listener('b')
        }
        return undefined
      },
      finalMessage: async () => claudeText('ab'),
    })

    const onChunk = vi.fn()
    const { streamWithProviderChain } = await loadProviders()
    const { result } = await streamWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS, { onChunk })

    expect(result?.provider).toBe('claude')
    expect(onChunk).toHaveBeenCalledTimes(2)
  })

  it('falls through to the Gemini stream when Claude fails before emitting', async () => {
    sdk.claudeStream.mockReturnValue({
      on: () => undefined,
      finalMessage: async () => {
        throw new sdk.APIError('claude down', 400)
      },
    })

    sdk.geminiSendMessageStream.mockResolvedValue({
      stream: (async function* () {
        yield { text: () => 'gem' }
      })(),
    })

    const onChunk = vi.fn()
    const { streamWithProviderChain } = await loadProviders()
    const { result, attempts } = await streamWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS, {
      onChunk,
    })

    expect(result?.provider).toBe('gemini')
    expect(onChunk).toHaveBeenCalledWith('gem')
    expect(attempts[0]).toMatchObject({ provider: 'claude', result: 'error' })
  })

  it('marks OpenAI as streaming-unsupported rather than silently dropping it', async () => {
    process.env.OPENAI_API_KEY = 'openai-key'
    process.env.CHAT_MULTI_PROVIDER_ENABLED = 'true'
    sdk.claudeStream.mockReturnValue({
      on: () => undefined,
      finalMessage: async () => {
        throw new sdk.APIError('down', 400)
      },
    })
    sdk.geminiSendMessageStream.mockRejectedValue(new Error('down'))

    const { streamWithProviderChain } = await loadProviders()
    const { result, attempts } = await streamWithProviderChain('hi', NO_HISTORY, PROMPT_PARTS, {
      onChunk: vi.fn(),
    })

    expect(result).toBeNull()
    expect(attempts).toContainEqual({
      provider: 'openai',
      result: 'skipped',
      reason: 'streaming_unsupported',
    })
  })
})

describe('getProviderHealth', () => {
  it('reports all three providers plus the resolved order', async () => {
    const { getProviderHealth } = await loadProviders()
    const health = getProviderHealth()

    expect(health.order).toEqual(['claude', 'gemini', 'openai'])
    expect(health.providers.claude).toEqual({ configured: true, circuitOpen: false })
    expect(health.providers.openai).toEqual({ configured: false, circuitOpen: false })
    expect(health.status).toBe('active')
  })

  it('is inactive when nothing usable is configured', async () => {
    delete process.env.ANTHROPIC_API_KEY
    delete process.env.GOOGLE_GEMINI_API_KEY

    const { getProviderHealth } = await loadProviders()
    expect(getProviderHealth().status).toBe('inactive')
  })

  it('does not count a configured OpenAI while the multi-provider flag is off', async () => {
    delete process.env.ANTHROPIC_API_KEY
    delete process.env.GOOGLE_GEMINI_API_KEY
    process.env.OPENAI_API_KEY = 'openai-key'

    const { getProviderHealth } = await loadProviders()
    const health = getProviderHealth()

    expect(health.providers.openai.configured).toBe(true)
    expect(health.status).toBe('inactive')
  })
})
