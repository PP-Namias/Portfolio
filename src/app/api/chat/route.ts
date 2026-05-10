import { NextRequest, NextResponse } from 'next/server';

import profileData from '../../../../portfolio-resources/data/profile.json';
import experiencesData from '../../../../portfolio-resources/data/experiences.json';
import projectsData from '../../../../portfolio-resources/data/projects.json';
import technologiesData from '../../../../portfolio-resources/data/technologies.json';
import certificationsData from '../../../../portfolio-resources/data/certifications.json';
import membershipsData from '../../../../portfolio-resources/data/memberships.json';
import socialsData from '../../../../portfolio-resources/data/socials.json';

import { buildFallbackResponse, buildPresetResponse } from './lib/fallbackResponder';
import {
  classifyProviderError,
  generateWithGemini,
  generateWithOpenAI,
  getProviderHealth,
  isMultiProviderEnabled,
} from './lib/providers';
import { buildSystemPrompt } from './lib/promptBuilder';
import {
  detectInjectionAttempt,
  detectUnsafeRequest,
  filterOutput,
  generateSecureSystemPrompt,
  logSecurityEvent,
  validateMessageContent,
} from './lib/securityGuards';
import { checkRateLimit } from './lib/chatRateLimit';
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

const chatDataContext: ChatDataContext = {
  profile: profileData as ProfileData,
  experiences: experiencesData as ExperienceData[],
  projects: projectsData as ProjectData[],
  technologies: technologiesData as TechnologyData[],
  certifications: certificationsData as CertificationData[],
  memberships: membershipsData as MembershipData[],
  socials: socialsData as SocialData[],
};

const systemPrompt = buildSystemPrompt(chatDataContext);

interface RequestBody {
  message?: unknown;
  history?: unknown;
}

interface ParsedChatRequest {
  message: string;
  history: ConversationHistoryMessage[];
}

interface ValidationError {
  error: string;
  status: number;
}

function getClientIp(request: NextRequest): string {
  return (
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

  return {
    message,
    history: normalizeHistory(body.history),
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

export async function GET() {
  const health = getProviderHealth();
  const statusCode = health.status === 'active' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}

export async function POST(request: NextRequest) {
  let fallbackUserMessage = '';
  const requestId = createRequestId(request);
  const requestStartedAt = Date.now();
  const clientIp = getClientIp(request);

  try {
    // Enhanced rate limiting check (new security system)
    const rateLimitCheck = checkRateLimit(clientIp);
    if (!rateLimitCheck.success) {
      logSecurityEvent('warn', 'rate_limit_exceeded', {
        clientIp,
        remaining: rateLimitCheck.remaining,
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

    const { message, history } = parsedRequest;
    fallbackUserMessage = message;

    // Security Guard: Validate message content
    const messageValidation = validateMessageContent(message);
    if (!messageValidation.valid) {
      logSecurityEvent('warn', 'invalid_message_content', {
        error: messageValidation.error,
        length: message.length,
      });

      return withRequestId(
        NextResponse.json({ error: 'Invalid message content.' }, { status: 400 }),
        requestId
      );
    }

    // Security Guard: Detect injection attempts
    const injectionCheck = detectInjectionAttempt(message);
    if (injectionCheck.detected) {
      logSecurityEvent('warn', 'injection_attempt_detected', {
        type: injectionCheck.type,
        reason: injectionCheck.reason,
        clientIp,
      });

      return withRequestId(
        NextResponse.json(
          { error: 'Your message could not be processed. Please try a different question.' },
          { status: 400 }
        ),
        requestId
      );
    }

    const unsafeRequest = detectUnsafeRequest(message);
    if (unsafeRequest.detected) {
      logSecurityEvent('warn', 'unsafe_request_detected', {
        type: unsafeRequest.type,
        reason: unsafeRequest.reason,
        clientIp,
      });

      return withRequestId(
        NextResponse.json(
          { error: 'Your request could not be processed safely.' },
          { status: 400 }
        ),
        requestId
      );
    }

    const presetResponse = buildPresetResponse(message, chatDataContext);
    if (presetResponse) {
      logEvent('info', 'chat_preset_response', {
        requestId,
        latencyMs: Date.now() - requestStartedAt,
      });

      // Security Guard: Filter PII from output
      const filteredPreset = filterOutput(presetResponse);

      return withRequestId(
        NextResponse.json({ message: filteredPreset, preset: true, fallback: false }),
        requestId
      );
    }

    // Use secure system prompt for all AI provider calls
    const secureSystemPrompt = generateSecureSystemPrompt();

    const providerAttempts: Array<Record<string, unknown>> = [];

    try {
      const geminiResult = await generateWithGemini(message, history, secureSystemPrompt);

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

      // Security Guard: Filter PII from output
      const filteredMessage = filterOutput(geminiResult.message);

      return withRequestId(
        NextResponse.json({ message: filteredMessage, fallback: false }),
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
        const openAiResult = await generateWithOpenAI(message, history, secureSystemPrompt);

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

        // Security Guard: Filter PII from output
        const filteredMessage = filterOutput(openAiResult.message);

        return withRequestId(
          NextResponse.json({ message: filteredMessage, fallback: false }),
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

    const fallbackResponse = buildFallbackResponse(message, chatDataContext);

    // Security Guard: Filter PII from fallback response
    const filteredFallback = filterOutput(fallbackResponse);

    logEvent('warn', 'chat_fallback_response', {
      requestId,
      totalLatencyMs: Date.now() - requestStartedAt,
      failoverCount: isMultiProviderEnabled() ? 2 : 1,
      providerAttempts,
    });

    return withRequestId(
      NextResponse.json({
        message: filteredFallback,
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
      const fallbackMsg = buildFallbackResponse(fallbackUserMessage, chatDataContext);
      const filteredFallbackMsg = filterOutput(fallbackMsg);

      return withRequestId(
        NextResponse.json({
          message: filteredFallbackMsg,
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
