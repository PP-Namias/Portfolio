import '@testing-library/jest-dom';
import { beforeAll, vi } from 'vitest';

// Global test setup
beforeAll(() => {
  // Setup any global test configurations here
});

// Mock global objects if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});