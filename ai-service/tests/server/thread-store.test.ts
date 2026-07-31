import { existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

import { createThreadStore } from '../../src/lib/thread-store';

let filePath: string;
let store: ReturnType<typeof createThreadStore>;

beforeAll(() => {
  filePath = join(tmpdir(), `ai-service-threads-${process.pid}-${Date.now()}.json`);
  store = createThreadStore({ filePath });
});

afterAll(() => {
  rmSync(filePath, { force: true });
});

describe('thread-store', () => {
  it('creates a thread with a default title and timestamps', async () => {
    const thread = await store.create();
    expect(thread.id).toBeTruthy();
    expect(thread.title).toBe('New conversation');
    expect(thread.messages).toEqual([]);
    expect(thread.createdAt).toBeTruthy();
    expect(thread.updatedAt).toBe(thread.createdAt);
  });

  it('returns null for a missing thread', async () => {
    expect(await store.get('does-not-exist')).toBeNull();
  });

  it('updates a thread title and bumps updatedAt', async () => {
    const thread = await store.create('Old title');
    const updated = await store.update(thread.id, { title: 'New title' });
    expect(updated?.title).toBe('New title');
    expect(updated?.updatedAt).toBeTruthy();
  });

  it('appends messages and tracks message count in summaries', async () => {
    const thread = await store.create();
    await store.appendMessage(thread.id, { role: 'user', content: 'hi' });
    await store.appendMessage(thread.id, { role: 'assistant', content: 'hello', citations: [] });
    const loaded = await store.get(thread.id);
    expect(loaded?.messages).toHaveLength(2);
    expect(loaded?.messages[0]?.role).toBe('user');
    expect(loaded?.messages[1]?.content).toBe('hello');

    const summaries = await store.list();
    const summary = summaries.find((item) => item.id === thread.id);
    expect(summary?.messageCount).toBe(2);
  });

  it('does not append to a missing thread', async () => {
    expect(await store.appendMessage('nope', { role: 'user', content: 'x' })).toBeNull();
  });

  it('removes a thread and reports existence', async () => {
    const thread = await store.create();
    expect(await store.remove(thread.id)).toBe(true);
    expect(await store.remove(thread.id)).toBe(false);
    expect(await store.get(thread.id)).toBeNull();
  });

  it('persists threads to disk', () => {
    expect(existsSync(filePath)).toBe(true);
    const raw = readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Array<{ id: string }>;
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.every((item) => typeof item.id === 'string')).toBe(true);
  });
});
