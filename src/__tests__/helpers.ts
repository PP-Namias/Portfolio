import { vi } from 'vitest';
import type { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Sanity client mock factory
// ---------------------------------------------------------------------------

export function createSanityClientMock(overrides: Record<string, unknown> = {}) {
  return {
    fetch: vi.fn().mockResolvedValue([]),
    getDocument: vi.fn().mockResolvedValue(null),
    getDocuments: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ _id: 'new' }),
    createIfNotExists: vi.fn().mockResolvedValue({ _id: 'existing' }),
    patch: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    unset: vi.fn().mockReturnThis(),
    commit: vi.fn().mockResolvedValue({}),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// NextRequest / NextResponse mock factories
// ---------------------------------------------------------------------------

export function createMockRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  } = {},
) {
  const { method = 'GET', headers = {}, body } = options;
  const init: RequestInit = {
    method,
    headers: new Headers(headers),
  };
  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  return new Request(url, init) as unknown as NextRequest;
}

export function createMockNextResponse(data?: unknown, init?: ResponseInit) {
  if (data !== undefined) {
    return Response.json(data, init) as unknown as NextResponse;
  }
  return new Response(null, init) as unknown as NextResponse;
}

// ---------------------------------------------------------------------------
// Fetch mock helpers
// ---------------------------------------------------------------------------

export function mockFetchOnce(response: unknown, status = 200) {
  const fn = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(typeof response === 'string' ? response : JSON.stringify(response)),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    headers: new Headers({ 'content-type': 'application/json' }),
  });
  globalThis.fetch = fn;
  return fn;
}

export function mockFetchSequential(responses: Array<{ data: unknown; status?: number }>) {
  let callCount = 0;
  const fn = vi.fn().mockImplementation(() => {
    const { data, status = 200 } = responses[callCount] ?? responses[responses.length - 1];
    callCount++;
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      headers: new Headers({ 'content-type': 'application/json' }),
    });
  });
  globalThis.fetch = fn;
  return fn;
}

// ---------------------------------------------------------------------------
// Environment variable helpers
// ---------------------------------------------------------------------------

export function setEnv(key: string, value: string) {
  const prev = process.env[key];
  process.env[key] = value;
  return () => {
    if (prev === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = prev;
    }
  };
}

export function mockEnv(vars: Record<string, string>) {
  const restoreFns = Object.entries(vars).map(([k, v]) => setEnv(k, v));
  return () => restoreFns.forEach((fn) => fn());
}

// ---------------------------------------------------------------------------
// Middleware mock helpers
// ---------------------------------------------------------------------------

export function createMiddlewareRequest(
  pathname: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    ip?: string;
  } = {},
) {
  const { method = 'GET', headers = {}, ip } = options;
  if (ip) {
    headers['x-forwarded-for'] = ip;
  }
  const url = `https://namias.tech${pathname}`;
  return createMockRequest(url, { method, headers });
}

// ---------------------------------------------------------------------------
// Chat API mock helpers
// ---------------------------------------------------------------------------

export function mockGeminiResponse(text: string) {
  return mockFetchOnce({
    candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }],
    usageMetadata: { totalTokenCount: 100 },
  });
}

export function mockOpenAIResponse(text: string) {
  return mockFetchOnce({
    choices: [{ message: { content: text }, finish_reason: 'stop' }],
    usage: { total_tokens: 100 },
  });
}
