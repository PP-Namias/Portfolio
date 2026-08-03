import { describe, it, expect, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PathMemory } from '@/components/ui/PathMemory';
import { getPrevPath } from '@/lib/path-memory';

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => '/'),
}));

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}));

describe('PathMemory', () => {
  afterEach(() => {
    window.sessionStorage.clear();
    usePathnameMock.mockReset();
    usePathnameMock.mockReturnValue('/');
  });

  it('records the previous path when the route changes', () => {
    usePathnameMock.mockReturnValue('/blog/some-post');
    const { rerender } = render(<PathMemory />);
    expect(window.sessionStorage.getItem('pp_prev_path')).toBeNull();
    usePathnameMock.mockReturnValue('/');
    rerender(<PathMemory />);
    expect(window.sessionStorage.getItem('pp_prev_path')).toBe('/blog/some-post');
  });

  it('stores the latest origin when navigating between routes', () => {
    usePathnameMock.mockReturnValue('/blog');
    const { rerender } = render(<PathMemory />);
    usePathnameMock.mockReturnValue('/blog/some-post');
    rerender(<PathMemory />);
    expect(window.sessionStorage.getItem('pp_prev_path')).toBe('/blog');
    usePathnameMock.mockReturnValue('/blog/some-other-post');
    rerender(<PathMemory />);
    expect(window.sessionStorage.getItem('pp_prev_path')).toBe('/blog/some-post');
  });

  it('exposes getPrevPath() that returns the stored origin', () => {
    usePathnameMock.mockReturnValue('/blog');
    const { rerender } = render(<PathMemory />);
    usePathnameMock.mockReturnValue('/blog/some-post');
    rerender(<PathMemory />);
    expect(getPrevPath()).toBe('/blog');
  });

  it('getPrevPath() returns null when nothing was stored', () => {
    expect(getPrevPath()).toBeNull();
  });

  it('does not break when sessionStorage is unavailable', () => {
    const orig = window.sessionStorage.getItem.bind(window.sessionStorage);
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(getPrevPath()).toBeNull();
    expect(() => render(<PathMemory />)).not.toThrow();
    window.sessionStorage.getItem = orig;
  });
});
