import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

import profileData from '../../../../portfolio-resources/data/profile.json';
import experiencesData from '../../../../portfolio-resources/data/experiences.json';
import projectsData from '../../../../portfolio-resources/data/projects.json';
import technologiesData from '../../../../portfolio-resources/data/technologies.json';
import certificationsData from '../../../../portfolio-resources/data/certifications.json';
import membershipsData from '../../../../portfolio-resources/data/memberships.json';
import socialsData from '../../../../portfolio-resources/data/socials.json';

import { buildFallbackResponse, buildPresetResponse } from './lib/fallbackResponder';
import { buildSystemPrompt } from './lib/promptBuilder';
import { isRateLimited } from './lib/rateLimiter';
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

const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
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

function stripHtml(str: string): string {
  return str.replaceAll(/<[^>]*>/g, '');
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

  const message = stripHtml(body.message).trim();

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

function mapHistoryForModel(history: ConversationHistoryMessage[]) {
  return history.slice(-10).map((item) => ({
    role: item.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: item.content }],
  }));
}

async function tryModelResponse(
  genAI: GoogleGenerativeAI,
  modelName: string,
  message: string,
  history: ConversationHistoryMessage[]
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
    history: mapHistoryForModel(history),
  });

  const result = await chat.sendMessage(message);
  const response = result.response.text().trim();

  if (!response) {
    throw new Error('Gemini returned an empty response.');
  }

  return response;
}

async function generateGeminiResponse(
  genAI: GoogleGenerativeAI,
  message: string,
  history: ConversationHistoryMessage[]
): Promise<string | null> {
  let lastError: unknown = null;

  for (const modelName of MODELS) {
    try {
      return await tryModelResponse(genAI, modelName, message, history);
    } catch (modelError) {
      lastError = modelError;
      const errorMessage = modelError instanceof Error ? modelError.message : String(modelError);
      console.warn(`[Chat API] ${modelName} failed, trying next model...`, errorMessage);
    }
  }

  if (lastError) {
    const finalError =
      lastError instanceof Error
        ? lastError.message
        : (() => {
            try {
              return JSON.stringify(lastError);
            } catch {
              return 'Unknown non-serializable Gemini error';
            }
          })();
    console.error('[Chat API Error]', finalError);
  }

  return null;
}

export async function POST(request: NextRequest) {
  let fallbackUserMessage = '';

  try {
    if (await isRateLimited(getClientIp(request))) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as RequestBody | null;
    const parsedRequest = parseChatRequest(body);

    if (isValidationError(parsedRequest)) {
      return NextResponse.json({ error: parsedRequest.error }, { status: parsedRequest.status });
    }

    const { message, history } = parsedRequest;
    fallbackUserMessage = message;

    const presetResponse = buildPresetResponse(message, chatDataContext);
    if (presetResponse) {
      return NextResponse.json({ message: presetResponse, preset: true, fallback: false });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Chat API] GOOGLE_GEMINI_API_KEY is missing. Serving fallback response.');
      return NextResponse.json({
        message: buildFallbackResponse(message, chatDataContext),
        fallback: true,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const response = await generateGeminiResponse(genAI, message, history);

    if (response) {
      return NextResponse.json({ message: response, fallback: false });
    }

    return NextResponse.json({
      message: buildFallbackResponse(message, chatDataContext),
      fallback: true,
    });
  } catch (error) {
    console.error('[Chat API Error]', error instanceof Error ? error.message : error);

    if (fallbackUserMessage) {
      return NextResponse.json({
        message: buildFallbackResponse(fallbackUserMessage, chatDataContext),
        fallback: true,
      });
    }

    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
