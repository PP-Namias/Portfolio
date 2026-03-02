'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAccentColor, ACCENT_SCHEMES } from '@/hooks/useAccentColor';

export function ColorSchemePicker() {
  const { scheme, setScheme, mounted } = useAccentColor();

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5">
        {ACCENT_SCHEMES.map((s) => (
          <div key={s.name} className="h-4 w-4 rounded-full bg-surface-light dark:bg-card-bg-dark" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Accent color">
      {ACCENT_SCHEMES.map((s) => (
        <button
          key={s.name}
          onClick={() => setScheme(s)}
          className={cn(
            'h-4 w-4 rounded-full transition-all duration-200 flex-shrink-0',
            scheme.name === s.name
              ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black scale-110'
              : 'hover:scale-110 opacity-70 hover:opacity-100'
          )}
          style={{
            backgroundColor: s.preview,
            ...(scheme.name === s.name ? { ringColor: s.preview } : {}),
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
