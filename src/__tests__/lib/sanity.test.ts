import { describe, it, expect, vi } from 'vitest';
import { safeFetchSanity } from '../../lib/sanity';

describe('safeFetchSanity', () => {
  it('falls back to static data if no project ID is configured', async () => {
    const fallback = [{ id: '1' }];
    const result = await safeFetchSanity('*[_type == "project"]', fallback);
    expect(result).toEqual(fallback);
  });
});
