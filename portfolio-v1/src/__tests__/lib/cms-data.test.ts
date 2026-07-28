import { describe, it, expect } from 'vitest';
import {
  isSanityCutoverEnabled,
  contentSourceMode,
  contentSourceCatalog,
  contentSourceSummary,
} from '@/lib/cms-data';

describe('cms-data', () => {
  it('isSanityCutoverEnabled is a boolean', () => {
    expect(typeof isSanityCutoverEnabled).toBe('boolean');
  });

  it('contentSourceMode is sanity-ready', () => {
    expect(contentSourceMode).toBe('sanity-ready');
  });

  it('contentSourceCatalog contains expected entries', () => {
    expect(contentSourceCatalog.length).toBeGreaterThan(0);
    expect(contentSourceCatalog[0].sourceFile).toContain('profile');
    expect(contentSourceCatalog[0].targetModel).toContain('profile');
  });

  it('contentSourceCatalog has 10 entries', () => {
    expect(contentSourceCatalog).toHaveLength(10);
  });

  it('contentSourceSummary is a non-empty string', () => {
    expect(typeof contentSourceSummary).toBe('string');
    expect(contentSourceSummary.length).toBeGreaterThan(0);
  });

  it('contentSourceSummary contains each catalog entry', () => {
    for (const entry of contentSourceCatalog) {
      expect(contentSourceSummary).toContain(entry.sourceFile);
      expect(contentSourceSummary).toContain(entry.targetModel);
    }
  });
});
