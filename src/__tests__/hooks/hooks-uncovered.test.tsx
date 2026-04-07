import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

let resolvedThemeValue: 'dark' | 'light' = 'dark';
const setThemeMock = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: resolvedThemeValue,
    resolvedTheme: resolvedThemeValue,
    setTheme: setThemeMock,
  }),
}));

import { useCarousel } from '@/hooks/useCarousel';
import { useTheme } from '@/hooks/useTheme';
import { AccentColorProvider, useAccentColor, ACCENT_SCHEMES } from '@/hooks/useAccentColor';

function CarouselHarness() {
  const { currentIndex, goNext, goPrev, goTo, setIsHovered } = useCarousel({
    totalItems: 3,
    autoAdvanceInterval: 50,
  });

  return (
    <div>
      <span data-testid="index">{currentIndex}</span>
      <button onClick={goNext}>next</button>
      <button onClick={goPrev}>prev</button>
      <button onClick={() => goTo(2)}>goto2</button>
      <button onClick={() => setIsHovered(true)}>hover-on</button>
      <button onClick={() => setIsHovered(false)}>hover-off</button>
    </div>
  );
}

function ThemeHarness() {
  const { mounted, isDark, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="mounted">{String(mounted)}</span>
      <span data-testid="is-dark">{String(isDark)}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

function AccentHarness() {
  const { scheme, setScheme, mounted } = useAccentColor();

  return (
    <div>
      <span data-testid="scheme">{scheme.name}</span>
      <span data-testid="mounted">{String(mounted)}</span>
      <button onClick={() => setScheme(ACCENT_SCHEMES[1])}>set-blue</button>
    </div>
  );
}

describe('uncovered hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    localStorage.clear();
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-hover');
    document.documentElement.style.removeProperty('--accent-hover-dark');
    resolvedThemeValue = 'dark';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('useCarousel supports manual navigation and wrap-around', () => {
    render(<CarouselHarness />);

    expect(screen.getByTestId('index')).toHaveTextContent('0');
    fireEvent.click(screen.getByText('next'));
    expect(screen.getByTestId('index')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('goto2'));
    expect(screen.getByTestId('index')).toHaveTextContent('2');

    fireEvent.click(screen.getByText('next'));
    expect(screen.getByTestId('index')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('prev'));
    expect(screen.getByTestId('index')).toHaveTextContent('2');
  });

  it('useCarousel auto-advances and pauses when hovered', () => {
    render(<CarouselHarness />);

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.getByTestId('index')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('hover-on'));
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.getByTestId('index')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('hover-off'));
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.getByTestId('index')).toHaveTextContent('2');
  });

  it('useTheme exposes mounted flag and toggles theme target', async () => {
    render(<ThemeHarness />);

    expect(screen.getByTestId('mounted')).toHaveTextContent('true');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('toggle'));
    expect(setThemeMock).toHaveBeenCalledWith('light');

    resolvedThemeValue = 'light';
    render(<ThemeHarness />);
    fireEvent.click(screen.getAllByText('toggle')[1]);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('useAccentColor loads default and persists selected scheme', async () => {
    render(
      <AccentColorProvider>
        <AccentHarness />
      </AccentColorProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('mounted')).toHaveTextContent('true');
    expect(screen.getByTestId('scheme')).toHaveTextContent('pink');

    fireEvent.click(screen.getByText('set-blue'));

    expect(screen.getByTestId('scheme')).toHaveTextContent('blue');
    expect(localStorage.getItem('accent-color')).toBe('blue');
    expect(document.documentElement.style.getPropertyValue('--accent')).toContain('37 99 235');
  });

  it('useAccentColor initializes from localStorage when available', async () => {
    localStorage.setItem('accent-color', 'green');

    render(
      <AccentColorProvider>
        <AccentHarness />
      </AccentColorProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('scheme')).toHaveTextContent('green');
    expect(document.documentElement.style.getPropertyValue('--accent')).toContain('5 150 105');
  });
});
