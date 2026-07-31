import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

import { getEnv } from '../config/env';

let cached: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  const env = getEnv();
  if (!cached) {
    cached = new GoogleGenerativeAIEmbeddings({
      model: env.embeddingModel,
      apiKey: env.geminiApiKey,
    });
  }
  return cached;
}

export async function embedText(text: string): Promise<number[]> {
  return getEmbeddings().embedQuery(text);
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }
  return getEmbeddings().embedDocuments(texts);
}
