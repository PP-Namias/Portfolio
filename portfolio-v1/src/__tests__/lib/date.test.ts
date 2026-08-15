import { describe, it, expect } from 'vitest';
import { formatDateUtc } from '@/lib/date';

describe('formatDateUtc', () => {
  it('formats a date string in UTC', () => {
    const result = formatDateUtc('2026-07-28', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(result).toBe('July 28, 2026');
  });

  it('formats a Date object', () => {
    const result = formatDateUtc(new Date('2026-01-01T00:00:00Z'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    expect(result).toBe('Jan 1, 2026');
  });

  it('formats a timestamp number', () => {
    const result = formatDateUtc(1769990400000, {
      year: 'numeric',
      month: 'short',
    });
    expect(result).toBe('Feb 2026');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDateUtc('not-a-date', { year: 'numeric' })).toBe('');
  });

  it('returns empty string for NaN date', () => {
    expect(formatDateUtc(Number.NaN, { year: 'numeric' })).toBe('');
  });

  it('always uses UTC timezone regardless of local timezone', () => {
    const result = formatDateUtc('2026-06-15T23:00:00Z', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(result).toBe('June 15, 2026');
  });
});
