'use client';

import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccentColor, ACCENT_SCHEMES } from '@/hooks/useAccentColor';

export function ColorSchemePicker() {
  const { scheme, setScheme, mounted } = useAccentColor();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(max-width: 960px)');
    const syncCompactState = (matches: boolean) => {
      setIsCompact(matches);
    };

    syncCompactState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncCompactState(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5">
        {ACCENT_SCHEMES.map((s) => (
          <div key={s.name} className="h-4 w-4 rounded-full bg-surface-light dark:bg-card-bg-dark" />
        ))}
      </div>
    );
  }

  if (isCompact) {
    const currentIndex = ACCENT_SCHEMES.findIndex((s) => s.name === scheme.name);
    const nextScheme = ACCENT_SCHEMES[(currentIndex + 1) % ACCENT_SCHEMES.length];

    return (
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setScheme(nextScheme)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border-light bg-surface-light px-2.5 text-xs font-medium text-text-muted-light transition-colors hover:text-text-primary-light dark:border-border-dark dark:bg-card-bg-dark dark:text-text-muted-dark dark:hover:text-text-primary-dark"
          aria-label={`Change accent color, current ${scheme.label}`}
          title={`Accent: ${scheme.label} (tap to cycle)`}
        >
          <Palette className="h-3.5 w-3.5" aria-hidden="true" />
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: scheme.preview }}
            aria-hidden="true"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Accent color">
      {ACCENT_SCHEMES.map((s) => (
        <button
          key={s.name}
          type="button"
          onClick={() => setScheme(s)}
          className={cn(
            'h-4 w-4 rounded-full transition-all duration-200 flex-shrink-0',
            scheme.name === s.name
              ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black scale-110'
              : 'hover:scale-110 opacity-70 hover:opacity-100'
          )}
          style={{
            backgroundColor: s.preview,
            ...(scheme.name === s.name ? { '--tw-ring-color': s.preview } as React.CSSProperties : {}),
          }}
          role="radio"
          aria-checked={scheme.name === s.name}
          aria-label={s.label}
          title={s.label}
        />
      ))}
    </div>
  );
}
