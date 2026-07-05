import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock next/headers so that draftMode(), headers(), and cookies() don't
// throw when server components or CMS helpers are imported in tests.
vi.mock('next/headers', () => ({
  draftMode: vi.fn().mockResolvedValue({ isEnabled: false }),
  headers: vi.fn().mockReturnValue(new Map()),
  cookies: vi.fn().mockReturnValue({ get: () => undefined, getAll: () => [] }),
}));

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

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
});

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
});

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
});
