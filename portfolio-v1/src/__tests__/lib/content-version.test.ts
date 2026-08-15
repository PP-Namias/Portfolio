import { describe, it, expect, vi, beforeEach } from 'vitest';

const state = vi.hoisted(() => {
  process.env.REDIS_CACHE_URL = 'http://redis.test:6379';
  process.env.REDIS_CACHE_TOKEN = 'unit-test-token';
  return { fail: false, store: new Map<string, unknown>() };
});

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({
    get: vi.fn(async function (key: string) {
      if (state.fail) throw new Error('redis unavailable');
      return state.store.get(key) ?? null;
    }),
    incr: vi.fn(async function (key: string) {
      if (state.fail) throw new Error('redis unavailable');
      const current = state.store.get(key);
      const next = (typeof current === 'number' ? current : 0) + 1;
      state.store.set(key, next);
      return next;
    }),
  })),
}));

import {
  CONTENT_VERSION_INITIAL,
  CONTENT_VERSION_KEY,
  getContentVersion,
  bumpContentVersion,
  getSanityLivePollMs,
  DEFAULT_SANITY_LIVE_POLL_MS,
} from '@/lib/content-version';

describe('content-version', () => {
  beforeEach(() => {
    state.store.clear();
    state.fail = false;
  });

  it('returns the initial version before any bump', async () => {
    expect(await getContentVersion()).toBe(CONTENT_VERSION_INITIAL);
  });

  it('bumps monotonically through Redis and reads back the same value', async () => {
    expect(await bumpContentVersion()).toBe(1);
    expect(await bumpContentVersion()).toBe(2);
    expect(await getContentVersion()).toBe(2);
  });

  it('falls back to an in-memory counter when Redis is down', async () => {
    state.fail = true;
    const first = await bumpContentVersion();
    expect(first).toBeGreaterThan(0);
    expect(await getContentVersion()).toBe(first);
    expect(await bumpContentVersion()).toBe(first + 1);
  });

  it('uses the Redis-backed value once Redis recovers', async () => {
    state.fail = true;
    await bumpContentVersion();
    state.fail = false;
    state.store.set(CONTENT_VERSION_KEY, 5);
    expect(await getContentVersion()).toBe(5);
    expect(await bumpContentVersion()).toBe(6);
  });

  it('parses NEXT_PUBLIC_SANITY_LIVE_POLL_MS and falls back to the default', async () => {
    const previous = process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS;
    process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS = '300';
    expect(getSanityLivePollMs()).toBe(300);
    delete process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS;
    expect(getSanityLivePollMs()).toBe(DEFAULT_SANITY_LIVE_POLL_MS);
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS;
    } else {
      process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS = previous;
    }
  });
});