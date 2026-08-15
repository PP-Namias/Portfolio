import { getEnv } from '../config/env';
import { logger } from '../lib/logger';
import type { Chunk } from '../ingest/types';

const DEFAULT_TIMEOUT_MS = 30_000;

export interface UpstashVectorRecord {
  id: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

export interface UpstashQueryResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

async function request<T>(path: string, body: unknown, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const env = getEnv();
  if (!env.upstashVectorUrl || !env.upstashVectorToken) {
    throw new Error('Upstash Vector is not configured. Set UPSTASH_VECTOR_URL and UPSTASH_VECTOR_TOKEN.');
  }

  const response = await fetch(`${env.upstashVectorUrl.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.upstashVectorToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upstash Vector ${path} failed (${response.status}): ${errorText.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

export function buildVectorId(chunk: Chunk): string {
  return `aisvc:${chunk.docType}:${chunk.docId}:${chunk.chunkIndex}`;
}

export async function upsertVectors(vectors: UpstashVectorRecord[]): Promise<void> {
  if (vectors.length === 0) {
    return;
  }
  await request('/upsert', vectors);
}

function toFilterExpression(filter: Record<string, unknown>): string {
  return Object.entries(filter)
    .map(([key, value]) => `${key} = "${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
    .join(' AND ');
}

export async function queryVectors(
  vector: number[],
  topK: number,
  includeMetadata = true,
  filter?: Record<string, unknown>,
): Promise<UpstashQueryResult[]> {
  const result = await request<{ result?: UpstashQueryResult[]; results?: UpstashQueryResult[] }>('/query', {
    vector,
    topK,
    includeMetadata,
    includeVectors: false,
    filter: toFilterExpression(filter ?? { namespace: 'aisvc' }),
  });
  return result.result ?? result.results ?? [];
}

export async function deleteVectors(ids: string[]): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  await request('/delete', { ids });
}

export async function deleteByMetadata(filter: Record<string, unknown>): Promise<void> {
  await request('/delete', { filter: toFilterExpression(filter) });
}

export async function resetIndex(): Promise<void> {
  await request('/reset', {});
}

export async function getVectorCount(): Promise<number> {
  try {
    const result = await request<{ result?: { vectorCount?: number; total?: number } }>('/info', {});
    return result.result?.vectorCount ?? result.result?.total ?? 0;
  } catch (error) {
    logger.warn({ err: String(error) }, 'failed to read vector count, reporting 0');
    return 0;
  }
}
