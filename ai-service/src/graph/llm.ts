import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { BaseMessage } from '@langchain/core/messages';
import type { Runnable } from '@langchain/core/runnables';

import { getEnv } from '../config/env';

export function createChatModel(model?: string): ChatGoogleGenerativeAI {
  const env = getEnv();
  return new ChatGoogleGenerativeAI({
    model: model ?? env.llmModel,
    apiKey: env.geminiApiKey,
    temperature: env.temperature,
    maxOutputTokens: env.maxTokens,
  });
}

export function createChatModelWithFallback(): Runnable<BaseLanguageModelInput, BaseMessage> {
  const env = getEnv();
  if (env.llmFallbackModel && env.llmFallbackModel !== env.llmModel) {
    return createChatModel(env.llmModel).withFallbacks({
      fallbacks: [createChatModel(env.llmFallbackModel)],
    });
  }
  return createChatModel(env.llmModel);
}
