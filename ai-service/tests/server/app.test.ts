import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rmSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/graph/build-graph', () => ({
  runRag: vi.fn(),
}));

vi.mock('../../src/vector/indexer', () => ({
  reindexAll: vi.fn(),
  incrementalIndex: vi.fn(),
  getIndexStats: vi.fn(),
}));

import { runRag } from '../../src/graph/build-graph';
import { getIndexStats, incrementalIndex, reindexAll } from '../../src/vector/indexer';
import { buildApp } from '../../src/server/app';
import type { RagResult } from '../../src/graph/types';

const mockRunRag = vi.mocked(runRag);
const mockReindexAll = vi.mocked(reindexAll);
const mockIncrementalIndex = vi.mocked(incrementalIndex);
const mockGetIndexStats = vi.mocked(getIndexStats);

const threadsFile = join(tmpdir(), `ai-service-app-${process.pid}-${Date.now()}.json`);

beforeAll(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
  process.env.UPSTASH_VECTOR_URL = 'https://test.upstash.io/';
  process.env.UPSTASH_VECTOR_TOKEN = 'test-token';
  process.env.REINDEX_SECRET = 'test-secret';
  process.env.AI_SERVICE_THREADS_FILE = threadsFile;
});

afterAll(() => {
  rmSync(threadsFile, { force: true });
});

beforeEach(() => {
  vi.clearAllMocks();
  mockRunRag.mockResolvedValue(makeRagResult());
  mockReindexAll.mockResolvedValue(makeReindexResult('full'));
  mockIncrementalIndex.mockResolvedValue(makeReindexResult('incremental'));
  mockGetIndexStats.mockResolvedValue({ totalVectors: 42, lastIndexedAt: '2026-01-01T00:00:00Z', indexedDocuments: 7 });
});

function makeRagResult(overrides: Partial<RagResult> = {}): RagResult {
  return {
    response: 'PP Namias built several projects with modern stacks [1].',
    intent: 'portfolio',
    reformulatedQuery: 'rewritten query',
    citations: [{ index: 1, docId: 'p1', docType: 'project', title: 'Project One', urlPath: '/projects/p1', score: 0.9 }],
    usedContext: true,
    validated: true,
    status: 'validate:done',
    latencyMs: 123,
    ...overrides,
  };
}

function makeReindexResult(mode: 'full' | 'incremental' | 'dry-run') {
  return {
    mode,
    indexed: 10,
    skipped: 2,
    removed: 0,
    totalVectors: 42,
    totalChunks: 12,
    byType: { project: 10, post: 2 },
  };
}

function app() {
  return buildApp();
}

describe('health and stats', () => {
  it('GET /api/health reports ok', async () => {
    const res = await app().request('/api/health');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; vectorStoreConfigured: boolean };
    expect(body.status).toBe('ok');
    expect(body.vectorStoreConfigured).toBe(true);
  });

  it('GET /api/stats returns index stats', async () => {
    const res = await app().request('/api/stats');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { totalVectors: number };
    expect(body.totalVectors).toBe(42);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await app().request('/api/nope');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/chat (JSON mode)', () => {
  it('returns the RAG result with a thread id', async () => {
    const res = await app().request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'What projects did you build?' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as RagResult & { threadId: string };
    expect(mockRunRag).toHaveBeenCalledWith('What projects did you build?', []);
    expect(body.response).toContain('modern stacks');
    expect(body.citations).toHaveLength(1);
    expect(body.threadId).toBeTruthy();
  });

  it('passes thread history when a threadId is provided', async () => {
    const res = await app().request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'tell me more', threadId: 'missing-thread' }),
    });
    expect(res.status).toBe(404);
  });

  it('rejects empty messages with 400', async () => {
    const res = await app().request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: '   ' }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Invalid chat request');
  });
});

describe('POST /api/chat (SSE mode)', () => {
  it('streams status, token, and done events', async () => {
    const res = await app().request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
      body: JSON.stringify({ message: 'What projects did you build?' }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const text = await res.text();
    expect(text).toContain('event: status');
    expect(text).toContain('event: token');
    expect(text).toContain('event: done');
    expect(text).toContain('modern stacks');
    expect(text).toContain('"threadId"');
  });

  it('emits an error event when generation fails', async () => {
    mockRunRag.mockRejectedValue(new Error('boom'));
    const res = await app().request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
      body: JSON.stringify({ message: 'hello' }),
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('event: error');
    expect(text).toContain('Failed to generate a response');
  });
});

describe('thread endpoints', () => {
  it('creates, lists, reads, patches, and deletes threads', async () => {
    const createRes = await app().request('/api/chat/threads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'My thread' }),
    });
    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { thread: { id: string; title: string } };
    expect(created.thread.title).toBe('My thread');

    const listRes = await app().request('/api/chat/threads');
    const listBody = (await listRes.json()) as { threads: Array<{ id: string }> };
    expect(listBody.threads.some((t) => t.id === created.thread.id)).toBe(true);

    const getRes = await app().request(`/api/chat/threads/${created.thread.id}`);
    expect(getRes.status).toBe(200);

    const patchRes = await app().request(`/api/chat/threads/${created.thread.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Renamed' }),
    });
    const patched = (await patchRes.json()) as { thread: { title: string } };
    expect(patched.thread.title).toBe('Renamed');

    const delRes = await app().request(`/api/chat/threads/${created.thread.id}`, { method: 'DELETE' });
    expect(delRes.status).toBe(204);

    const missingRes = await app().request(`/api/chat/threads/${created.thread.id}`);
    expect(missingRes.status).toBe(404);
  });

  it('persists chat exchanges onto an existing thread', async () => {
    const createRes = await app().request('/api/chat/threads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    const created = (await createRes.json()) as { thread: { id: string } };

    const chatRes = await app().request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'hello there', threadId: created.thread.id }),
    });
    expect(chatRes.status).toBe(200);
    expect(mockRunRag).toHaveBeenCalledWith('hello there', []);

    const getRes = await app().request(`/api/chat/threads/${created.thread.id}`);
    const body = (await getRes.json()) as { thread: { messages: Array<{ role: string; content: string }> } };
    expect(body.thread.messages).toHaveLength(2);
    expect(body.thread.messages[0]?.role).toBe('user');
    expect(body.thread.messages[1]?.role).toBe('assistant');
  });
});

describe('admin endpoints', () => {
  it('rejects requests without a valid secret', async () => {
    const res = await app().request('/api/admin/reindex', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'incremental' }),
    });
    expect(res.status).toBe(401);
  });

  it('rejects requests with a wrong secret', async () => {
    const res = await app().request('/api/admin/reindex', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-reindex-secret': 'wrong' },
      body: JSON.stringify({ mode: 'incremental' }),
    });
    expect(res.status).toBe(401);
  });

  it('runs an incremental reindex with the correct secret', async () => {
    const res = await app().request('/api/admin/reindex', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-reindex-secret': 'test-secret' },
      body: JSON.stringify({ mode: 'incremental' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; result: { mode: string; indexed: number } };
    expect(body.ok).toBe(true);
    expect(mockIncrementalIndex).toHaveBeenCalledWith({ dryRun: false });
    expect(body.result.mode).toBe('incremental');
  });

  it('runs a full reindex when requested', async () => {
    const res = await app().request('/api/admin/reindex', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-reindex-secret': 'test-secret' },
      body: JSON.stringify({ mode: 'full', reset: true, dryRun: true }),
    });
    expect(res.status).toBe(200);
    expect(mockReindexAll).toHaveBeenCalledWith({ dryRun: true, reset: true });
  });

  it('exposes guarded admin stats', async () => {
    const res = await app().request('/api/admin/stats', {
      headers: { 'x-reindex-secret': 'test-secret' },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { totalVectors: number };
    expect(body.totalVectors).toBe(42);
  });
});

describe('rate limiting', () => {
  it('rejects requests beyond the chat window limit (429)', async () => {
    const instance = app();
    for (let i = 0; i < 30; i += 1) {
      const res = await instance.request('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: `ping ${i}` }),
      });
      expect(res.status).toBe(200);
    }
    const res = await instance.request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'one too many' }),
    });
    expect(res.status).toBe(429);
  });
});
