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

import { useTheme } from '@/hooks/useTheme';
import { AccentColorProvider, useAccentColor, ACCENT_SCHEMES } from '@/hooks/useAccentColor';

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
    localStorage.clear();
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-hover');
    document.documentElement.style.removeProperty('--accent-hover-dark');
    resolvedThemeValue = 'dark';
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
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
