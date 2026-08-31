import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock next/headers so that draftMode(), headers(), and cookies() don't
// throw when server components or CMS helpers are imported in tests.
vi.mock('next/headers', () => ({
  draftMode: vi.fn().mockResolvedValue({ isEnabled: false }),
  headers: vi.fn().mockReturnValue(new Map()),
  cookies: vi.fn().mockReturnValue({ get: () => undefined, getAll: () => [] }),
}))

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// jsdom polyfills used by layout/scroll/sticky components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class ResizeObserverMock {
  constructor(_callback: ResizeObserverCallback) {}
  observe(_target: Element, _options?: ResizeObserverOptions) {}
  unobserve(_target: Element) {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
})

class IntersectionObserverMock {
  constructor(_callback: IntersectionObserverCallback) {}
  observe(_target: Element) {}
  unobserve(_target: Element) {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
})

// vitest's jsdom environment does not forward jsdom's Storage instances onto
// globalThis, so `localStorage` arrives as a bare object and every getItem /
// setItem call throws "is not a function". jsdom implements Storage correctly,
// so this only bridges the gap — the loop below is a no-op wherever the real
// Storage does make it through.
function createStorageStub(): Storage {
  const entries = new Map<string, string>()

  const api = {
    get length() {
      return entries.size
    },
    key: (index: number) => [...entries.keys()][index] ?? null,
    getItem: (key: string) => (entries.has(String(key)) ? entries.get(String(key))! : null),
    setItem: (key: string, value: string) => {
      entries.set(String(key), String(value))
    },
    removeItem: (key: string) => {
      entries.delete(String(key))
    },
    clear: () => {
      entries.clear()
    },
  }

  // Real Storage also exposes each stored item as an own enumerable property.
  // `localFlush()` in src/lib/local-cache.ts iterates `Object.keys(localStorage)`,
  // so a plain object would silently find nothing to flush.
  return new Proxy(api, {
    get: (target, prop) =>
      prop in target ? target[prop as keyof typeof target] : entries.get(String(prop)),
    set: (target, prop, value) => {
      entries.set(String(prop), String(value))
      return true
    },
    has: (target, prop) => prop in target || entries.has(String(prop)),
    deleteProperty: (_target, prop) => {
      entries.delete(String(prop))
      return true
    },
    ownKeys: () => [...entries.keys()],
    getOwnPropertyDescriptor: (_target, prop) =>
      entries.has(String(prop))
        ? {
            value: entries.get(String(prop)),
            enumerable: true,
            configurable: true,
            writable: true,
          }
        : undefined,
  }) as unknown as Storage
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
  const existing = globalThis[name] as Storage | undefined

  if (typeof existing?.getItem === 'function') {
    continue
  }

  const stub = createStorageStub()

  Object.defineProperty(globalThis, name, { value: stub, writable: true, configurable: true })

  if (typeof window !== 'undefined' && window !== (globalThis as unknown as Window)) {
    Object.defineProperty(window, name, { value: stub, writable: true, configurable: true })
  }
}
