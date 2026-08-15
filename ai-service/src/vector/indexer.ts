import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { prepareKnowledgeBase } from '../ingest/indexer';
import type { Chunk } from '../ingest/types';
import { logger } from '../lib/logger';
import { embedDocuments } from './embeddings';
import { withRetry } from './retry';
import {
  buildVectorId,
  deleteByMetadata,
  getVectorCount,
  resetIndex,
  upsertVectors,
  type UpstashVectorRecord,
} from './upstash-store';

const EMBED_BATCH_SIZE = 10;
const EMBED_BATCH_DELAY_MS = 200;

const STATE_PATH = fileURLToPath(new URL('../../.ai-service-data/index-state.json', import.meta.url));

export interface IndexState {
  version: 1;
  lastIndexedAt: string | null;
  documents: Record<string, string>;
}

export interface ReindexResult {
  mode: 'full' | 'incremental' | 'dry-run';
  indexed: number;
  skipped: number;
  removed: number;
  totalVectors: number;
  totalChunks: number;
  byType: Record<string, number>;
}

function createEmptyState(): IndexState {
  return { version: 1, lastIndexedAt: null, documents: {} };
}

export async function loadIndexState(): Promise<IndexState> {
  try {
    const raw = await readFile(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as IndexState;
    if (parsed.version !== 1) {
      return createEmptyState();
    }
    return parsed;
  } catch {
    return createEmptyState();
  }
}

export async function saveIndexState(state: IndexState): Promise<void> {
  await mkdir(dirname(STATE_PATH), { recursive: true });
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function buildDocMap(chunks: Chunk[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const chunk of chunks) {
    const previous = map[chunk.docId];
    if (!previous || chunk.metadata.updatedAt > previous) {
      map[chunk.docId] = chunk.metadata.updatedAt;
    }
  }
  return map;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedChunks(chunks: Chunk[]): Promise<UpstashVectorRecord[]> {
  const records: UpstashVectorRecord[] = [];

  for (let i = 0; i < chunks.length; i += EMBED_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBED_BATCH_SIZE);
    const vectors = await withRetry(() => embedDocuments(batch.map((chunk) => chunk.text)));

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j]!;
      const vector = vectors[j];
      if (!vector || vector.length === 0) {
        continue;
      }
      records.push({
        id: buildVectorId(chunk),
        vector,
        metadata: {
          namespace: 'aisvc',
          docId: chunk.docId,
          docType: chunk.docType,
          chunkIndex: chunk.chunkIndex,
          chunkText: chunk.text.slice(0, 500),
          title: chunk.metadata.title ?? '',
          slug: chunk.metadata.slug ?? '',
          category: chunk.metadata.category ?? '',
          urlPath: chunk.metadata.urlPath,
          updatedAt: chunk.metadata.updatedAt,
          field: chunk.metadata.field ?? '',
          tags: (chunk.metadata.tags ?? []).join(','),
          indexedAt: new Date().toISOString(),
        },
      });
    }

    if (i + EMBED_BATCH_SIZE < chunks.length) {
      await sleep(EMBED_BATCH_DELAY_MS);
    }
  }

  return records;
}

export async function reindexAll(options: { dryRun?: boolean; reset?: boolean } = {}): Promise<ReindexResult> {
  const { chunks, stats } = await prepareKnowledgeBase();

  if (options.reset && !options.dryRun) {
    await resetIndex();
    await saveIndexState(createEmptyState());
  }

  const records = await embedChunks(chunks);

  if (!options.dryRun) {
    await upsertVectors(records);
    await saveIndexState({
      version: 1,
      lastIndexedAt: new Date().toISOString(),
      documents: buildDocMap(chunks),
    });
  }

  const totalVectors = options.dryRun ? records.length : await getVectorCount();

  logger.info(
    { mode: 'full', indexed: records.length, dryRun: options.dryRun ?? false },
    'full reindex complete',
  );

  return {
    mode: options.dryRun ? 'dry-run' : 'full',
    indexed: records.length,
    skipped: stats.skippedEmpty + stats.deduplicated,
    removed: 0,
    totalVectors,
    totalChunks: chunks.length,
    byType: stats.byType,
  };
}

export async function incrementalIndex(options: { dryRun?: boolean } = {}): Promise<ReindexResult> {
  const { chunks, stats } = await prepareKnowledgeBase();
  const state = await loadIndexState();
  const freshDocs = buildDocMap(chunks);

  const removed: string[] = [];
  for (const docId of Object.keys(state.documents)) {
    if (!freshDocs[docId]) {
      removed.push(docId);
    }
  }

  const changed = new Set<string>();
  for (const [docId, updatedAt] of Object.entries(freshDocs)) {
    if (state.documents[docId] !== updatedAt) {
      changed.add(docId);
    }
  }

  const staleDocIds = new Set([...changed, ...removed]);
  const toEmbed = chunks.filter((chunk) => staleDocIds.has(chunk.docId));

  if (!options.dryRun) {
    for (const docId of staleDocIds) {
      try {
        await deleteByMetadata({ docId });
      } catch (error) {
        logger.warn({ docId, err: String(error) }, 'failed to delete stale vectors');
      }
    }
  }

  const records = await embedChunks(toEmbed);

  if (!options.dryRun) {
    await upsertVectors(records);
    await saveIndexState({
      version: 1,
      lastIndexedAt: new Date().toISOString(),
      documents: freshDocs,
    });
  }

  const totalVectors = options.dryRun ? records.length : await getVectorCount();

  logger.info(
    { mode: 'incremental', changed: changed.size, removed: removed.length, indexed: records.length },
    'incremental index complete',
  );

  return {
    mode: options.dryRun ? 'dry-run' : 'incremental',
    indexed: records.length,
    skipped: chunks.length - toEmbed.length + stats.skippedEmpty + stats.deduplicated,
    removed: removed.length,
    totalVectors,
    totalChunks: chunks.length,
    byType: stats.byType,
  };
}

export async function getIndexStats(): Promise<{
  totalVectors: number;
  lastIndexedAt: string | null;
  indexedDocuments: number;
}> {
  const [totalVectors, state] = await Promise.all([getVectorCount(), loadIndexState()]);
  return {
    totalVectors,
    lastIndexedAt: state.lastIndexedAt,
    indexedDocuments: Object.keys(state.documents).length,
  };
}
