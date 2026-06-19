'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [setTheme, resolvedTheme]);

  const isDark = resolvedTheme === 'dark';

  return {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    isDark,
    mounted,
  };
}
