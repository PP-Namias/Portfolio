import { getEnv, isVectorStoreConfigured } from '../../config/env';
import { logger } from '../../lib/logger';
import { embedText } from '../../vector/embeddings';
import { withRetry } from '../../vector/retry';
import { queryVectors } from '../../vector/upstash-store';
import type { RagState, RetrievedChunk } from '../types';

export async function retrieveNode(state: RagState): Promise<Partial<RagState>> {
  if (!isVectorStoreConfigured()) {
    return { retrievedChunks: [], status: 'retrieve:skipped' };
  }

  try {
    const env = getEnv();
    const query = state.reformulatedQuery || state.query;
    const embedding = await withRetry(() => embedText(query));
    const results = await queryVectors(embedding, env.ragTopK * 2, true);

    const chunks: RetrievedChunk[] = results.map((result) => {
      const metadata = result.metadata ?? {};
      return {
        id: result.id,
        docId: (metadata.docId as string) ?? result.id,
        docType: (metadata.docType as string) ?? 'unknown',
        chunkIndex: (metadata.chunkIndex as number) ?? 0,
        text: (metadata.chunkText as string) ?? '',
        score: result.score,
        metadata,
      };
    });

    logger.debug({ count: chunks.length }, 'retrieved chunks');
    return { retrievedChunks: chunks, status: 'retrieve:done' };
  } catch (error) {
    logger.warn({ err: String(error) }, 'retrieval failed');
    return { retrievedChunks: [], status: 'retrieve:error' };
  }
}
