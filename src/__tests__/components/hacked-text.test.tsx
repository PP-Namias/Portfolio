import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { HackedText } from '@/components/ui/hacked-text';

vi.useFakeTimers({ shouldAdvanceTime: true });

describe('HackedText', () => {
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.restoreAllMocks();
  });

  it('renders with initial text', () => {
    render(<HackedText text="Hello" />);
    expect(screen.getByText('Hello')).toBeDefined();
  });

  it('sets aria-label to text', () => {
    render(<HackedText text="Hello" />);
    expect(screen.getByLabelText('Hello')).toBeDefined();
  });

  it('sets data-value attribute', () => {
    render(<HackedText text="Hello" />);
    expect(screen.getByText('Hello')).toHaveAttribute('data-value', 'Hello');
  });

  it('applies custom className', () => {
    render(<HackedText text="Hello" className="custom-class" />);
    const span = screen.getByText('Hello');
    expect(span.className).toContain('custom-class');
  });

  it('runs hack animation on mouse over', async () => {
    render(<HackedText text="AB" />);
    const span = screen.getByText('AB');

    await act(async () => {
      span.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

    vi.advanceTimersByTime(100);
    const text = span.textContent;
    expect(text).toBeDefined();
  });

  it('restores final text after iteration completes', async () => {
    render(<HackedText text="Hi" />);
    const span = screen.getByText('Hi');

    await act(async () => {
      span.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

    vi.advanceTimersByTime(1000);
    expect(span.textContent).toBe('Hi');
  });

  it('clears interval on unmount', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(<HackedText text="Hi" />);
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
