import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

describe('isAdminRequest', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when ADMIN_API_KEY is not set', async () => {
    vi.stubEnv('ADMIN_API_KEY', '');
    const { isAdminRequest } = await import('@/lib/admin');
    const req = new NextRequest('https://namias.tech/api/test');
    expect(isAdminRequest(req)).toBe(false);
  });

  it('returns true when x-api-key matches ADMIN_API_KEY', async () => {
    vi.stubEnv('ADMIN_API_KEY', 'secret-key-123');
    const { isAdminRequest } = await import('@/lib/admin');
    const req = new NextRequest('https://namias.tech/api/test', {
      headers: { 'x-api-key': 'secret-key-123' },
    });
    expect(isAdminRequest(req)).toBe(true);
  });

  it('returns false when x-api-key does not match', async () => {
    vi.stubEnv('ADMIN_API_KEY', 'secret-key-123');
    const { isAdminRequest } = await import('@/lib/admin');
    const req = new NextRequest('https://namias.tech/api/test', {
      headers: { 'x-api-key': 'wrong-key' },
    });
    expect(isAdminRequest(req)).toBe(false);
  });

  it('returns false when x-api-key is missing', async () => {
    vi.stubEnv('ADMIN_API_KEY', 'secret-key-123');
    const { isAdminRequest } = await import('@/lib/admin');
    const req = new NextRequest('https://namias.tech/api/test');
    expect(isAdminRequest(req)).toBe(false);
  });

  it('trims ADMIN_API_KEY before comparison', async () => {
    vi.stubEnv('ADMIN_API_KEY', '  trimmed-key  ');
    const { isAdminRequest } = await import('@/lib/admin');
    const req = new NextRequest('https://namias.tech/api/test', {
      headers: { 'x-api-key': 'trimmed-key' },
    });
    expect(isAdminRequest(req)).toBe(true);
  });
});
