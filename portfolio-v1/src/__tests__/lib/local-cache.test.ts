import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { localGet, localSet, localRemove, localFlush } from '@/lib/local-cache';

describe('local-cache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('localSet stores and localGet retrieves data', () => {
    localSet('test-key', { hello: 'world' });
    const result = localGet<{ hello: string }>('test-key');
    expect(result).toEqual({ hello: 'world' });
  });

  it('localGet returns null for missing key', () => {
    expect(localGet('nonexistent')).toBeNull();
  });

  it('localGet returns null for expired entry', () => {
    localSet('expires-fast', 'data', -1000);
    expect(localGet('expires-fast')).toBeNull();
  });

  it('localRemove deletes a key', () => {
    localSet('to-remove', 'data');
    localRemove('to-remove');
    expect(localGet('to-remove')).toBeNull();
  });

  it('localFlush removes all cache entries', () => {
    localSet('a', 1);
    localSet('b', 2);
    localSet('c', 3);
    const count = localFlush();
    expect(count).toBe(3);
    expect(localGet('a')).toBeNull();
    expect(localGet('b')).toBeNull();
    expect(localGet('c')).toBeNull();
  });

  it('localFlush returns 0 when no cache entries exist', () => {
    expect(localFlush()).toBe(0);
  });

  it('localSet with custom TTL', () => {
    localSet('ttl-test', 'value', 5000);
    const raw = localStorage.getItem('portfolio:cache:ttl-test');
    expect(raw).not.toBeNull();
    const entry = JSON.parse(raw!);
    expect(entry.data).toBe('value');
    expect(entry.expiresAt).toBeGreaterThan(Date.now());
  });

  it('localGet returns null for malformed JSON', () => {
    localStorage.setItem('portfolio:cache:bad', '{invalid');
    expect(localGet('bad')).toBeNull();
  });

  it('uses correct prefix for keys', () => {
    localSet('prefixed', 'val');
    expect(localStorage.getItem('portfolio:cache:prefixed')).not.toBeNull();
  });

  it('localRemove does not throw for missing key', () => {
    expect(() => localRemove('totally-missing')).not.toThrow();
  });
});
