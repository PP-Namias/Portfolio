import { redisGet, redisSet, redisInvalidateByTag, redisFlush, redisStats } from './redis-cache'

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  staleAt: number;
  tags: string[];
}

interface CacheOptions {
  ttlMs?: number;
  staleMs?: number;
  tags?: string[];
  skipRedis?: boolean;
}

const DEFAULT_TTL_MS = 300_000;
const DEFAULT_STALE_MS = 60_000;

const store = new Map<string, CacheEntry<unknown>>();

export function keyFor(...parts: string[]): string {
  return `cache:${parts.join(':')}`;
}

function isExpired(entry: CacheEntry<unknown>): boolean {
  return Date.now() > entry.expiresAt;
}

function isStale(entry: CacheEntry<unknown>): boolean {
  return Date.now() > entry.staleAt;
}

export function get<T>(key: string): { data: T; stale: boolean } | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (isExpired(entry)) {
    store.delete(key);
    return null;
  }
  return { data: entry.data, stale: isStale(entry) };
}

export function set<T>(key: string, data: T, options?: CacheOptions): void {
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  const staleMs = options?.staleMs ?? DEFAULT_STALE_MS;
  const now = Date.now();
  store.set(key, {
    data,
    expiresAt: now + ttlMs,
    staleAt: now + Math.min(staleMs, ttlMs),
    tags: options?.tags ?? [],
  });
  if (!options?.skipRedis) {
    redisSet(key, data, { ttlMs, staleMs, tags: options?.tags }).catch(() => {});
  }
}

export async function getOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): Promise<{ data: T; stale: boolean }> {
  const existing = get<T>(key);
  if (existing) {
    if (existing.stale) {
      fetcher()
        .then((fresh) => set(key, fresh, options))
        .catch(() => {});
    }
    return Promise.resolve(existing);
  }

  if (!options?.skipRedis) {
    try {
      const redisHit = await redisGet<T>(key);
      if (redisHit) {
        set(key, redisHit.data, { ...options, ttlMs: Math.min(options?.ttlMs ?? DEFAULT_TTL_MS, 60_000) });
        if (redisHit.stale) {
          fetcher()
            .then((fresh) => { set(key, fresh, options); redisSet(key, fresh, options).catch(() => {}); })
            .catch(() => {});
        }
        return redisHit;
      }
    } catch {
      // Redis unavailable — fall through to fetch
    }
  }

  return fetcher().then((data) => {
    set(key, data, options);
    return { data, stale: false };
  });
}

export async function invalidateByTag(tag: string): Promise<number> {
  let count = 0;
  for (const [key, entry] of store) {
    if (entry.tags.includes(tag)) {
      store.delete(key);
      count++;
    }
  }
  const redisCount = await redisInvalidateByTag(tag).catch(() => 0);
  return count + redisCount;
}

export function invalidateByPrefix(prefix: string): number {
  let count = 0;
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
      count++;
    }
  }
  return count;
}

export async function flush(): Promise<number> {
  const count = store.size;
  store.clear();
  const redisCount = await redisFlush().catch(() => 0);
  return count + redisCount;
}

export async function stats(): Promise<{
  l1: { size: number; keys: string[]; memoryEstimateBytes: number };
  l2: { size: number; redisConnected: boolean };
}> {
  const keys = Array.from(store.keys());
  let totalSize = 0;
  for (const entry of store.values()) {
    totalSize += JSON.stringify(entry.data).length * 2;
  }
  const l2 = await redisStats().catch(() => ({ size: 0, redisConnected: false }));
  return {
    l1: { size: keys.length, keys, memoryEstimateBytes: totalSize },
    l2,
  };
}

export { DEFAULT_TTL_MS, DEFAULT_STALE_MS };
