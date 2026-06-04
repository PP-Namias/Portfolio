const LOCAL_CACHE_PREFIX = 'portfolio:cache:';
const LOCAL_CACHE_DEFAULT_TTL_MS = 3_600_000;

interface LocalCacheEntry<T> {
  data: T;
  expiresAt: number;
}

function isSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const key = `${LOCAL_CACHE_PREFIX}_test`;
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function localGet<T>(key: string): T | null {
  if (!isSupported()) return null;
  try {
    const raw = localStorage.getItem(`${LOCAL_CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw) as LocalCacheEntry<T>;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(`${LOCAL_CACHE_PREFIX}${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function localSet<T>(key: string, data: T, ttlMs?: number): void {
  if (!isSupported()) return;
  const entry: LocalCacheEntry<T> = {
    data,
    expiresAt: Date.now() + (ttlMs ?? LOCAL_CACHE_DEFAULT_TTL_MS),
  };
  try {
    localStorage.setItem(`${LOCAL_CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // localStorage full — silently skip
  }
}

export function localRemove(key: string): void {
  if (!isSupported()) return;
  try {
    localStorage.removeItem(`${LOCAL_CACHE_PREFIX}${key}`);
  } catch {
    // silently skip
  }
}

export function localFlush(): number {
  if (!isSupported()) return 0;
  let count = 0;
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(LOCAL_CACHE_PREFIX)) {
        localStorage.removeItem(key);
        count++;
      }
    }
  } catch {
    // silently skip
  }
  return count;
}
