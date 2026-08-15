import { describe, expect, it, vi } from 'vitest';

import { withRetry } from '../../src/vector/retry';

describe('withRetry', () => {
  it('succeeds on the first attempt', async () => {
    const fn = vi.fn(async () => 'ok');
    await expect(withRetry(fn)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries until success', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('boom 1'))
      .mockRejectedValueOnce(new Error('boom 2'))
      .mockResolvedValueOnce('recovered');
    await expect(withRetry(fn, { maxAttempts: 4, baseDelayMs: 5 })).resolves.toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws the last error after exhausting attempts', async () => {
    const fn = vi.fn(async () => {
      throw new Error('persistent');
    });
    await expect(withRetry(fn, { maxAttempts: 3, baseDelayMs: 5 })).rejects.toThrow('persistent');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
