import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    headers: { get: (key: string) => string | null };
    constructor(_input: string, _init?: Record<string, unknown>) {
      const h: Record<string, string> = {};
      if (_init?.headers) {
        Object.assign(h, _init.headers as Record<string, string>);
      }
      this.headers = {
        get: (key: string) => h[key.toLowerCase()] ?? null,
      };
    }
  },
}));

import { isAdminRequest } from '@/lib/admin';

describe('isAdminRequest', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.ADMIN_API_KEY;
  });

  function makeRequest(headers: Record<string, string>) {
    const { NextRequest } = require('next/server');
    return new NextRequest('http://localhost', { headers });
  }

  it('returns true when x-api-key matches ADMIN_API_KEY', () => {
    process.env.ADMIN_API_KEY = 'secret-key-123';
    expect(isAdminRequest(makeRequest({ 'x-api-key': 'secret-key-123' }))).toBe(true);
  });

  it('returns false when x-api-key does not match', () => {
    process.env.ADMIN_API_KEY = 'secret-key-123';
    expect(isAdminRequest(makeRequest({ 'x-api-key': 'wrong-key' }))).toBe(false);
  });

  it('returns false when x-api-key header is missing', () => {
    process.env.ADMIN_API_KEY = 'secret-key-123';
    expect(isAdminRequest(makeRequest({}))).toBe(false);
  });

  it('returns false when ADMIN_API_KEY is not set', () => {
    expect(isAdminRequest(makeRequest({ 'x-api-key': 'some-key' }))).toBe(false);
  });

  it('trims whitespace from ADMIN_API_KEY', () => {
    process.env.ADMIN_API_KEY = '  secret-key-123  ';
    expect(isAdminRequest(makeRequest({ 'x-api-key': 'secret-key-123' }))).toBe(true);
  });
});
