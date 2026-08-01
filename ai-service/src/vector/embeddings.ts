import { GoogleGenAI } from '@google/genai';

import { getEnv } from '../config/env';

let cached: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const env = getEnv();
  if (!cached) {
    cached = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }
  return cached;
}

async function embed(
  text: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY',
): Promise<number[]> {
  const env = getEnv();
  const response = await getClient().models.embedContent({
    model: env.embeddingModel,
    contents: text,
    config: {
      taskType,
      outputDimensionality: env.embeddingDimensions,
    },
  });
  const values = response.embeddings?.[0]?.values;
  if (!values || values.length === 0) {
    throw new Error('Gemini embedding returned no values');
  }
  return values;
}

export async function embedText(text: string): Promise<number[]> {
  return embed(text, 'RETRIEVAL_QUERY');
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const vectors: number[][] = [];
  for (const text of texts) {
    vectors.push(await embed(text, 'RETRIEVAL_DOCUMENT'));
  }
  return vectors;
}
