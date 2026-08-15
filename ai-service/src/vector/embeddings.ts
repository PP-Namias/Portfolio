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

const EMBED_BATCH_SIZE = 10;

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
  if (texts.length === 0) {
    return [];
  }

  const env = getEnv();
  const vectors: number[][] = [];

  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    const response = await getClient().models.embedContent({
      model: env.embeddingModel,
      contents: batch,
      config: {
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: env.embeddingDimensions,
      },
    });

    const batchVectors = (response.embeddings ?? []).map((embedding) => embedding.values ?? []);
    if (batchVectors.length !== batch.length || batchVectors.some((vector) => vector.length === 0)) {
      throw new Error('Gemini embedding returned an incomplete batch');
    }
    vectors.push(...batchVectors);
  }

  return vectors;
}
