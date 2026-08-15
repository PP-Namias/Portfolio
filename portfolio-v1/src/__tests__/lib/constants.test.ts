import { describe, it, expect } from 'vitest';
import { DISCORD_PROFILE_URL, KO_FI_URL } from '@/lib/constants';

describe('constants', () => {
  it('DISCORD_PROFILE_URL is a valid URL', () => {
    expect(() => new URL(DISCORD_PROFILE_URL)).not.toThrow();
    expect(DISCORD_PROFILE_URL).toContain('discord.com');
  });

  it('KO_FI_URL is a valid URL', () => {
    expect(() => new URL(KO_FI_URL)).not.toThrow();
    expect(KO_FI_URL).toContain('ko-fi.com');
  });
});
