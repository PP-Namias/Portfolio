import { describe, it, expect } from 'vitest';
import {
  IS_BLOG_VISIBLE,
  IS_MAGIC_CURSOR_VISIBLE,
  IS_PROJECTS_REVAMP_ENABLED,
  IS_STREAMING_SSR_ENABLED,
  IS_LANGGRAPH_ENABLED,
  IS_CHAT_STREAMING_ENABLED,
  IS_CHAT_THREADING_ENABLED,
} from '@/lib/features';

describe('feature flags', () => {
  it('IS_BLOG_VISIBLE is a boolean', () => {
    expect(typeof IS_BLOG_VISIBLE).toBe('boolean');
  });

  it('IS_MAGIC_CURSOR_VISIBLE is a boolean', () => {
    expect(typeof IS_MAGIC_CURSOR_VISIBLE).toBe('boolean');
  });

  it('IS_PROJECTS_REVAMP_ENABLED is a boolean', () => {
    expect(typeof IS_PROJECTS_REVAMP_ENABLED).toBe('boolean');
  });

  it('IS_STREAMING_SSR_ENABLED is a boolean', () => {
    expect(typeof IS_STREAMING_SSR_ENABLED).toBe('boolean');
  });

  it('IS_LANGGRAPH_ENABLED is a boolean', () => {
    expect(typeof IS_LANGGRAPH_ENABLED).toBe('boolean');
  });

  it('IS_CHAT_STREAMING_ENABLED is a boolean', () => {
    expect(typeof IS_CHAT_STREAMING_ENABLED).toBe('boolean');
  });

  it('IS_CHAT_THREADING_ENABLED is a boolean', () => {
    expect(typeof IS_CHAT_THREADING_ENABLED).toBe('boolean');
  });

  it('all flags are exported with expected names', () => {
    const exportedFlags = [
      IS_BLOG_VISIBLE,
      IS_MAGIC_CURSOR_VISIBLE,
      IS_PROJECTS_REVAMP_ENABLED,
      IS_STREAMING_SSR_ENABLED,
      IS_LANGGRAPH_ENABLED,
      IS_CHAT_STREAMING_ENABLED,
      IS_CHAT_THREADING_ENABLED,
    ];
    expect(exportedFlags.length).toBe(7);
    exportedFlags.forEach((flag) => {
      expect(typeof flag).toBe('boolean');
    });
  });
});
