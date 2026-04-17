import { GoogleGenerativeAI } from '@google/generative-ai';

import { ConversationHistoryMessage } from './types';

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];

function parseIntegerEnv(name: string, fallbackValue: number, minimum = 0): number {
  const rawValue = process.env[name];
  const parsedValue = Number.parseInt(rawValue || '', 10);

  if (!Number.isFinite(parsedValue) || parsedValue < minimum) {
    return fallbackValue;
  }

  return parsedValue;
}

function getProviderTimeoutMs(): number {
  return parseIntegerEnv('CHAT_PROVIDER_TIMEOUT_MS', 12_000, 1);
}

function getProviderMaxRetries(): number {
  return parseIntegerEnv('CHAT_PROVIDER_MAX_RETRIES', 1, 0);
}

function getProviderRetryBaseMs(): number {
  return parseIntegerEnv('CHAT_PROVIDER_RETRY_BASE_MS', 220, 1);
}

function getCircuitFailureThreshold(): number {
  return parseIntegerEnv('CHAT_PROVIDER_CIRCUIT_FAILURE_THRESHOLD', 4, 1);
}

function getCircuitCooldownMs(): number {
  return parseIntegerEnv('CHAT_PROVIDER_CIRCUIT_COOLDOWN_MS', 60_000, 1);
}

function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}

function getOpenAiBaseUrl(): string {
  return (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
}

type ProviderName = 'gemini' | 'openai';

type CircuitState = {
  failures: number;
  openedAt: number | null;
};

const providerCircuitState: Record<ProviderName, CircuitState> = {
  gemini: { failures: 0, openedAt: null },
  openai: { failures: 0, openedAt: null },
};

interface ProviderGenerationResult {
  provider: ProviderName;
  model: string;
  message: string;
  attempts: number;
  latencyMs: number;
}

interface ProviderHealth {
  configured: boolean;
  circuitOpen: boolean;
}

interface ChatProviderHealth {
  status: 'active' | 'inactive';
  providers: Record<ProviderName, ProviderHealth>;
  multiProviderEnabled: boolean;
}

class ProviderUnavailableError extends Error {
  reason: 'missing_config' | 'circuit_open';
  provider: ProviderName;

  constructor(provider: ProviderName, reason: 'missing_config' | 'circuit_open', message: string) {
    super(message);
    this.name = 'ProviderUnavailableError';
    this.provider = provider;
    this.reason = reason;
  }
}

class ProviderTimeoutError extends Error {
  providerLabel: string;

  constructor(providerLabel: string, timeoutMs: number) {
    super(`${providerLabel} timed out after ${timeoutMs}ms.`);
    this.name = 'ProviderTimeoutError';
    this.providerLabel = providerLabel;
  }
}

function isMultiProviderEnabled(): boolean {
  const value = (process.env.CHAT_MULTI_PROVIDER_ENABLED || '').toLowerCase();
  return value === '1' || value === 'true' || value === 'yes' || value === 'on';
}

function isConfigured(provider: ProviderName): boolean {
  if (provider === 'gemini') {
    return Boolean(process.env.GOOGLE_GEMINI_API_KEY);
  }

  return Boolean(process.env.OPENAI_API_KEY);
}

function getCircuitState(provider: ProviderName): CircuitState {
  return providerCircuitState[provider];
}

function isCircuitOpen(provider: ProviderName): boolean {
  const state = getCircuitState(provider);

  if (!state.openedAt) {
    return false;
  }

  const isCoolingDown = Date.now() - state.openedAt < getCircuitCooldownMs();

  if (isCoolingDown) {
    return true;
  }

  state.failures = 0;
  state.openedAt = null;
  return false;
}

function markProviderSuccess(provider: ProviderName): void {
  const state = getCircuitState(provider);
  state.failures = 0;
  state.openedAt = null;
}

function markProviderFailure(provider: ProviderName): void {
  const state = getCircuitState(provider);
  state.failures += 1;

  if (state.failures >= getCircuitFailureThreshold()) {
    state.openedAt = Date.now();
  }
}

function getProviderHealth(): ChatProviderHealth {
  const multiProviderEnabled = isMultiProviderEnabled();

  const geminiConfigured = isConfigured('gemini');
  const geminiCircuitOpen = geminiConfigured && isCircuitOpen('gemini');

  const openaiConfigured = isConfigured('openai');
  const openaiCircuitOpen = openaiConfigured && isCircuitOpen('openai');

  const primaryHealthy = geminiConfigured && !geminiCircuitOpen;
  const secondaryHealthy = multiProviderEnabled && openaiConfigured && !openaiCircuitOpen;

  return {
    status: primaryHealthy || secondaryHealthy ? 'active' : 'inactive',
    multiProviderEnabled,
    providers: {
      gemini: {
        configured: geminiConfigured,
        circuitOpen: geminiCircuitOpen,
      },
      openai: {
        configured: openaiConfigured,
        circuitOpen: openaiCircuitOpen,
      },
    },
  };
}

function mapHistoryForGemini(history: ConversationHistoryMessage[]) {
  return history.slice(-10).map((item) => ({
    role: item.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: item.content }],
  }));
}

function mapHistoryForOpenAI(history: ConversationHistoryMessage[]) {
  return history.slice(-10).map((item) => ({
    role: item.role === 'assistant' ? 'assistant' : 'user',
    content: item.content,
  }));
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'unknown_error';
  }
}

function isTransientProviderError(error: unknown): boolean {
  const message = normalizeErrorMessage(error).toLowerCase();

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
  ].some((token) => message.includes(token));
}

function computeRetryDelayMs(attempt: number): number {
  const retryBaseMs = getProviderRetryBaseMs();
  const exponential = retryBaseMs * Math.pow(2, Math.max(0, attempt - 1));
  const jitter = Math.floor(Math.random() * Math.max(20, retryBaseMs * 0.35));
  return exponential + jitter;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executeWithRetry<T>(
  operation: (attempt: number) => Promise<T>
): Promise<{ value: T; attempts: number }> {
  const maxAttempts = Math.max(1, getProviderMaxRetries() + 1);
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const value = await operation(attempt);
      return { value, attempts: attempt };
    } catch (error) {
      lastError = error;

      if (attempt >= maxAttempts || !isTransientProviderError(error)) {
        throw error;
      }

      await sleep(computeRetryDelayMs(attempt));
    }
  }

  throw lastError;
}

async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  providerLabel: string
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      operation(),
      new Promise<T>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new ProviderTimeoutError(providerLabel, timeoutMs));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
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
  });

  const chat = model.startChat({
    history: mapHistoryForGemini(history),
  });

  const result = await chat.sendMessage(message);
  const response = result.response.text().trim();

  if (!response) {
    throw new Error('Gemini returned an empty response.');
  }

  return response;
}

async function generateWithGemini(
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string
): Promise<ProviderGenerationResult> {
  if (!isConfigured('gemini')) {
    throw new ProviderUnavailableError('gemini', 'missing_config', 'Gemini API key is not configured.');
  }

  if (isCircuitOpen('gemini')) {
    throw new ProviderUnavailableError('gemini', 'circuit_open', 'Gemini circuit is temporarily open.');
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);
  const timeoutMs = getProviderTimeoutMs();

  const providerStartedAt = Date.now();
  let lastError: unknown = null;

  try {
    for (const modelName of GEMINI_MODELS) {
      try {
        const { value, attempts } = await executeWithRetry((attempt) =>
          withTimeout(
            () => tryGeminiModel(genAI, modelName, message, history, systemPrompt),
            timeoutMs,
            `gemini:${modelName}:attempt-${attempt}`
          )
        );

        markProviderSuccess('gemini');

        return {
          provider: 'gemini',
          model: modelName,
          message: value,
          attempts,
          latencyMs: Date.now() - providerStartedAt,
        };
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Gemini failed across all configured models.');
  } catch (error) {
    markProviderFailure('gemini');
    throw error;
  }
}

async function requestOpenAIChatCompletion(
  model: string,
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string,
  attempt: number
): Promise<string> {
  const timeoutMs = getProviderTimeoutMs();
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

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
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `OpenAI request failed (${response.status}): ${errorBody.slice(0, 220) || response.statusText}`
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const content = payload.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('OpenAI returned an empty response.');
    }

    return content;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ProviderTimeoutError(`openai:${model}:attempt-${attempt}`, timeoutMs);
    }

    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

async function generateWithOpenAI(
  message: string,
  history: ConversationHistoryMessage[],
  systemPrompt: string
): Promise<ProviderGenerationResult> {
  if (!isConfigured('openai')) {
    throw new ProviderUnavailableError('openai', 'missing_config', 'OpenAI API key is not configured.');
  }

  if (isCircuitOpen('openai')) {
    throw new ProviderUnavailableError('openai', 'circuit_open', 'OpenAI circuit is temporarily open.');
  }

  const model = getOpenAiModel();
  const providerStartedAt = Date.now();

  try {
    const { value, attempts } = await executeWithRetry((attempt) =>
      requestOpenAIChatCompletion(model, message, history, systemPrompt, attempt)
    );

    markProviderSuccess('openai');

    return {
      provider: 'openai',
      model,
      message: value,
      attempts,
      latencyMs: Date.now() - providerStartedAt,
    };
  } catch (error) {
    markProviderFailure('openai');
    throw error;
  }
}

function classifyProviderError(error: unknown): string {
  if (error instanceof ProviderUnavailableError) {
    return `provider_unavailable:${error.provider}:${error.reason}`;
  }

  if (error instanceof ProviderTimeoutError) {
    return `provider_timeout:${error.providerLabel}`;
  }

  if (error instanceof Error) {
    return `provider_error:${error.name.toLowerCase()}`;
  }

  return 'provider_error:unknown';
}

export {
  classifyProviderError,
  generateWithGemini,
  generateWithOpenAI,
  getProviderHealth,
  isMultiProviderEnabled,
  ProviderUnavailableError,
};
export type { ProviderGenerationResult, ProviderName, ChatProviderHealth };
