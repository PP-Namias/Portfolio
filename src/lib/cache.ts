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
}

const DEFAULT_TTL_MS = 300_000;
const DEFAULT_STALE_MS = 60_000;

const store = new Map<string, CacheEntry<unknown>>();

function keyFor(...parts: string[]): string {
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
}

export function getOrFetch<T>(
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
  return fetcher().then((data) => {
    set(key, data, options);
    return { data, stale: false };
  });
}

export function invalidateByTag(tag: string): number {
  let count = 0;
  for (const [key, entry] of store) {
    if (entry.tags.includes(tag)) {
      store.delete(key);
      count++;
    }
  }
  return count;
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

export function flush(): number {
  const count = store.size;
  store.clear();
  return count;
}

export function stats(): { size: number; keys: string[]; memoryEstimateBytes: number } {
  const keys = Array.from(store.keys());
  let totalSize = 0;
  for (const entry of store.values()) {
    totalSize += JSON.stringify(entry.data).length * 2;
  }
  return { size: keys.length, keys, memoryEstimateBytes: totalSize };
}

export { keyFor, DEFAULT_TTL_MS, DEFAULT_STALE_MS };
