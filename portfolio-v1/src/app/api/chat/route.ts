import { NextRequest, NextResponse } from 'next/server';

import { getCmsContent } from '@/lib/cms-content.server';
import { retrieve, formatContext, isRagConfigured } from '@/lib/rag/retriever';

import { buildSmartFallback } from './lib/smartFallback';
import { classifyProviderError, generateWithGemini, generateWithOpenAI, getProviderHealth, isMultiProviderEnabled } from './lib/providers';
import { buildSystemPrompt } from './lib/promptBuilder';
import { isRateLimited } from './lib/rateLimiter';
import { IS_LANGGRAPH_ENABLED, IS_CHAT_STREAMING_ENABLED } from '@/lib/features';
import { runChatGraph } from '@/lib/chat/graph';
import { saveMessage } from '@/lib/chat/persistence';
import { RetrievedChunk } from '@/lib/rag/types';
import {
  CertificationData,
  ChatDataContext,
  ConversationHistoryMessage,
  ExperienceData,
  MembershipData,
  ProfileData,
  ProjectData,
  SocialData,
  TechnologyData,
} from './lib/types';

const MAX_MESSAGE_LENGTH = 500;

interface RequestBody {
  message?: unknown;
  history?: unknown;
  threadId?: unknown;
}

interface ParsedChatRequest {
  message: string;
  history: ConversationHistoryMessage[];
  threadId?: string;
}

interface ValidationError {
  error: string;
  status: number;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isHistoryMessage(value: unknown): value is ConversationHistoryMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as { role?: unknown; content?: unknown };
  return typeof candidate.role === 'string' && typeof candidate.content === 'string';
}

function normalizeHistory(input: unknown): ConversationHistoryMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter(isHistoryMessage);
}

function parseChatRequest(body: RequestBody | null): ParsedChatRequest | ValidationError {
  if (!body || typeof body.message !== 'string') {
    return { error: 'Message is required.', status: 400 };
  }

  const message = body.message.trim();

  if (message.length === 0) {
    return { error: 'Message cannot be empty.', status: 400 };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      error: `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
      status: 400,
    };
  }

  const threadId = typeof body.threadId === 'string' && body.threadId.trim()
    ? body.threadId.trim()
    : undefined;

  return {
    message,
    history: normalizeHistory(body.history),
    threadId,
  };
}

function isValidationError(
  result: ParsedChatRequest | ValidationError
): result is ValidationError {
  return 'status' in result;
}

function createRequestId(request: NextRequest): string {
  const existingId = request.headers.get('x-request-id')?.trim();

  if (existingId) {
    return existingId;
  }

  try {
    return crypto.randomUUID();
  } catch {
    return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function withRequestId(response: NextResponse, requestId: string): NextResponse {
  response.headers.set('x-request-id', requestId);
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  return response;
}

function logEvent(
  level: 'info' | 'warn' | 'error',
  event: string,
  details: Record<string, unknown>
): void {
  const payload = JSON.stringify({
    event,
    timestamp: new Date().toISOString(),
    ...details,
  });

  if (level === 'error') {
    console.error('[Chat API]', payload);
    return;
  }

  if (level === 'warn') {
    console.warn('[Chat API]', payload);
    return;
  }

  console.info('[Chat API]', payload);
}

function encodeSSE(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
  const health = getProviderHealth();
  const statusCode = health.status === 'active' ? 200 : 503;

  const response = NextResponse.json(health, { status: statusCode });
  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
  return response;
}

export async function POST(request: NextRequest) {
  let fallbackUserMessage = '';
  const requestId = createRequestId(request);
  const requestStartedAt = Date.now();
  const clientIp = getClientIp(request);
  let chatDataContext!: ChatDataContext;

  try {
    const cmsContent = await getCmsContent();
    chatDataContext = {
      profile: cmsContent.profile as ProfileData,
      experiences: cmsContent.experiences as ExperienceData[],
      projects: cmsContent.projects as ProjectData[],
      technologies: cmsContent.technologies as TechnologyData[],
      certifications: cmsContent.certifications as CertificationData[],
      memberships: cmsContent.memberships as MembershipData[],
      socials: cmsContent.socialLinks as SocialData[],
    };

    if (await isRateLimited(clientIp)) {
      logEvent('warn', 'chat_rate_limited', {
        requestId,
        clientIp,
      });

      return withRequestId(
        NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
        ),
        requestId
      );
    }

    const body = (await request.json().catch(() => null)) as RequestBody | null;
    const parsedRequest = parseChatRequest(body);

    if (isValidationError(parsedRequest)) {
      logEvent('warn', 'chat_validation_error', {
        requestId,
        status: parsedRequest.status,
      });

      return withRequestId(
        NextResponse.json({ error: parsedRequest.error }, { status: parsedRequest.status }),
        requestId
      );
    }

    const { message, history, threadId } = parsedRequest;
    fallbackUserMessage = message;

    const acceptsStreaming = request.headers.get('accept') === 'text/event-stream'
      && IS_CHAT_STREAMING_ENABLED
      && IS_LANGGRAPH_ENABLED;

    if (acceptsStreaming) {
      return handleStreamingResponse(request, message, history, threadId, chatDataContext, requestId);
    }

    if (IS_LANGGRAPH_ENABLED) {
      try {
        const result = await runChatGraph({
          message,
          history,
          threadId,
        });

        if (threadId) {
          saveMessage(threadId, 'user', message);
          saveMessage(threadId, 'assistant', result.response);
        }

        logEvent('info', 'chat_graph_success', {
          requestId,
          threadId: result.threadId,
          totalLatencyMs: Date.now() - requestStartedAt,
        });

        return withRequestId(
          NextResponse.json({ message: result.response, fallback: false, threadId: result.threadId }),
          requestId
        );
      } catch (graphError) {
        logEvent('warn', 'chat_graph_fallback', {
          requestId,
          error: graphError instanceof Error ? graphError.message : String(graphError),
        });
      }
    }

    let ragContext = '';
    let ragChunks: RetrievedChunk[] = [];
    try {
      if (isRagConfigured()) {
        ragChunks = await retrieve(message);
        ragContext = formatContext(ragChunks);
      }
    } catch {
    }

    const systemPrompt = buildSystemPrompt(chatDataContext, ragContext);

    const providerAttempts: Array<Record<string, unknown>> = [];

    try {
      const geminiResult = await generateWithGemini(message, history, systemPrompt);

      providerAttempts.push({
        provider: geminiResult.provider,
        model: geminiResult.model,
        attempts: geminiResult.attempts,
        latencyMs: geminiResult.latencyMs,
        result: 'success',
      });

      logEvent('info', 'chat_provider_success', {
        requestId,
        provider: geminiResult.provider,
        model: geminiResult.model,
        totalLatencyMs: Date.now() - requestStartedAt,
        failoverCount: 0,
      });

      return withRequestId(
        NextResponse.json({ message: geminiResult.message, fallback: false }),
        requestId
      );
    } catch (geminiError) {
      providerAttempts.push({
        provider: 'gemini',
        result: 'error',
        errorClass: classifyProviderError(geminiError),
      });
    }

    if (isMultiProviderEnabled()) {
      try {
        const openAiResult = await generateWithOpenAI(message, history, systemPrompt);

        providerAttempts.push({
          provider: openAiResult.provider,
          model: openAiResult.model,
          attempts: openAiResult.attempts,
          latencyMs: openAiResult.latencyMs,
          result: 'success',
        });

        logEvent('info', 'chat_provider_success', {
          requestId,
          provider: openAiResult.provider,
          model: openAiResult.model,
          totalLatencyMs: Date.now() - requestStartedAt,
          failoverCount: 1,
        });

        return withRequestId(
          NextResponse.json({ message: openAiResult.message, fallback: false }),
          requestId
        );
      } catch (openAiError) {
        providerAttempts.push({
          provider: 'openai',
          result: 'error',
          errorClass: classifyProviderError(openAiError),
        });
      }
    }

    const fallbackResponse = buildSmartFallback(message, chatDataContext, ragChunks);

    logEvent('warn', 'chat_fallback_response', {
      requestId,
      totalLatencyMs: Date.now() - requestStartedAt,
      failoverCount: isMultiProviderEnabled() ? 2 : 1,
      providerAttempts,
    });

    return withRequestId(
      NextResponse.json({
        message: fallbackResponse,
        fallback: true,
      }),
      requestId
    );
  } catch (error) {
    logEvent('error', 'chat_unhandled_exception', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      totalLatencyMs: Date.now() - requestStartedAt,
    });

    if (fallbackUserMessage) {
      return withRequestId(
        NextResponse.json({
          message: buildSmartFallback(fallbackUserMessage, chatDataContext),
          fallback: true,
        }),
        requestId
      );
    }

    return withRequestId(
      NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 }),
      requestId
    );
  }
}

async function handleStreamingResponse(
  request: NextRequest,
  message: string,
  history: ConversationHistoryMessage[],
  threadId: string | undefined,
  chatDataContext: ChatDataContext,
  requestId: string
): Promise<Response> {
  const resolvedThreadId = threadId || `thread_${Date.now()}`;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const encoder = new TextEncoder();

        controller.enqueue(encoder.encode(encodeSSE('status', { step: 'start', threadId: resolvedThreadId })));

        const result = await runChatGraph({
          message,
          history,
          threadId: resolvedThreadId,
          onToken: (token) => {
            controller.enqueue(encoder.encode(encodeSSE('token', { content: token })));
          },
          onToolCall: (name, args) => {
            controller.enqueue(encoder.encode(encodeSSE('tool_call', { name, args })));
          },
          onStatus: (step) => {
            controller.enqueue(encoder.encode(encodeSSE('status', { step, threadId: resolvedThreadId })));
          },
        });

        if (resolvedThreadId) {
          saveMessage(resolvedThreadId, 'user', message);
          saveMessage(resolvedThreadId, 'assistant', result.response);
        }

        controller.enqueue(encoder.encode(encodeSSE('done', { threadId: resolvedThreadId })));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Streaming error';
        controller.enqueue(encoder.encode(encodeSSE('error', { error: errorMsg })));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'x-request-id': requestId,
    },
  });
}
