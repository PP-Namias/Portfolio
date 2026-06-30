import { describe, it, expect } from 'vitest';
import { formatDateUtc } from '@/lib/date';

describe('formatDateUtc', () => {
  it('formats a date string', () => {
    const result = formatDateUtc('2026-01-15', { year: 'numeric', month: 'long', day: 'numeric' });
    expect(result).toBe('January 15, 2026');
  });

  it('formats a timestamp number', () => {
    const result = formatDateUtc(1700000000000, { year: 'numeric', month: 'short' });
    expect(result).toContain('2023');
  });

  it('formats a Date object', () => {
    const d = new Date('2026-06-30T12:00:00Z');
    const result = formatDateUtc(d, { year: 'numeric' });
    expect(result).toBe('2026');
  });

  it('returns empty string for invalid date', () => {
    const result = formatDateUtc('not-a-date', { year: 'numeric' });
    expect(result).toBe('');
  });

  it('uses UTC timezone', () => {
    const result = formatDateUtc('2026-01-01T23:59:59Z', { year: 'numeric', month: 'numeric', day: 'numeric' });
    expect(result).toBe('1/1/2026');
  });

  it('formats with different options', () => {
    const result = formatDateUtc('2026-03-15', { weekday: 'long' });
    expect(result).toBe('Sunday');
  });
});
