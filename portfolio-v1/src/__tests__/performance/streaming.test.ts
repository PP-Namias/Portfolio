import { describe, it, expect } from 'vitest';
import { createServerTimingHeader, parseServerTimingHeader } from '@/lib/streaming-metrics';

describe('createServerTimingHeader', () => {
  it('formats a single metric', () => {
    const header = createServerTimingHeader({ hero: 120 });
    expect(header).toBe('hero;dur=120');
  });

  it('formats multiple metrics', () => {
    const header = createServerTimingHeader({ hero: 120, about: 85, projects: 200 });
    expect(header).toBe('hero;dur=120, about;dur=85, projects;dur=200');
  });

  it('rounds fractional durations', () => {
    const header = createServerTimingHeader({ hero: 120.7 });
    expect(header).toBe('hero;dur=121');
  });
});

describe('parseServerTimingHeader', () => {
  it('parses a single metric', () => {
    const result = parseServerTimingHeader('hero;dur=120');
    expect(result).toEqual({ hero: 120 });
  });

  it('parses multiple metrics', () => {
    const result = parseServerTimingHeader('hero;dur=120, about;dur=85');
    expect(result).toEqual({ hero: 120, about: 85 });
  });

  it('round-trips correctly', () => {
    const metrics = { hero: 120, about: 85, projects: 200 };
    const header = createServerTimingHeader(metrics);
    const parsed = parseServerTimingHeader(header);
    expect(parsed).toEqual(metrics);
  });
});
