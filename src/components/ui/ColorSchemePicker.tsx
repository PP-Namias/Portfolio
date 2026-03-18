'use client';

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccentColor, ACCENT_SCHEMES } from '@/hooks/useAccentColor';

export function ColorSchemePicker() {
  const { scheme, setScheme, mounted } = useAccentColor();
  const [isCompact, setIsCompact] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const syncCompactState = (matches: boolean) => {
      setIsCompact(matches);
      setIsExpanded(false);
    };

    syncCompactState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncCompactState(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5">
        {ACCENT_SCHEMES.map((s) => (
          <div key={s.name} className="h-4 w-4 rounded-full bg-surface-light dark:bg-card-bg-dark" />
        ))}
      </div>
    );
  }

  const showExpandedPicker = !isCompact || isExpanded;

  if (isCompact) {
    return (
      <div ref={rootRef} className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border-light bg-surface-light px-2.5 text-xs font-medium text-text-muted-light transition-colors hover:text-text-primary-light dark:border-border-dark dark:bg-card-bg-dark dark:text-text-muted-dark dark:hover:text-text-primary-dark"
          aria-expanded={isExpanded}
          aria-controls="compact-accent-picker"
          aria-label="Toggle accent color picker"
          title="Accent color"
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: scheme.preview }}
            aria-hidden="true"
          />
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')}
            aria-hidden="true"
          />
        </button>

        {showExpandedPicker && (
          <div
            id="compact-accent-picker"
            className="flex max-w-[190px] flex-wrap justify-end gap-1.5"
            role="radiogroup"
            aria-label="Accent color"
          >
            {ACCENT_SCHEMES.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  setScheme(s);
                  setIsExpanded(false);
                }}
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
        )}
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
