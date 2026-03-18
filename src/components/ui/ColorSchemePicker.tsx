'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccentColor, ACCENT_SCHEMES } from '@/hooks/useAccentColor';

export function ColorSchemePicker() {
  const { scheme, setScheme, mounted } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border-light bg-surface-light px-2.5 text-xs font-medium text-text-muted-light dark:border-border-dark dark:bg-card-bg-dark dark:text-text-muted-dark">
        <Palette className="h-3.5 w-3.5" aria-hidden="true" />
        <div className="h-3 w-3 rounded-full bg-border-light dark:bg-border-dark" />
        <ChevronDown className="h-3 w-3 opacity-60" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative" ref={pickerRef}>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border-light bg-surface-light px-2.5 text-xs font-medium text-text-muted-light transition-colors hover:text-text-primary-light dark:border-border-dark dark:bg-card-bg-dark dark:text-text-muted-dark dark:hover:text-text-primary-dark"
          aria-label={`Select accent color, current ${scheme.label}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          title={`Accent: ${scheme.label}`}
        >
          <Palette className="h-3.5 w-3.5" aria-hidden="true" />
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: scheme.preview }}
            aria-hidden="true"
          />
          <ChevronDown
            className={cn('h-3 w-3 opacity-70 transition-transform duration-150', isOpen && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-border-light bg-white p-1.5 shadow-lg dark:border-border-dark dark:bg-card-bg-dark"
          role="listbox"
          aria-label="Accent color options"
        >
          {ACCENT_SCHEMES.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => {
                setScheme(s);
                setIsOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors',
                scheme.name === s.name
                  ? 'bg-surface-light text-text-primary-light dark:bg-surface-dark dark:text-text-primary-dark'
                  : 'text-text-muted-light hover:bg-surface-light hover:text-text-primary-light dark:text-text-muted-dark dark:hover:bg-surface-dark dark:hover:text-text-primary-dark'
              )}
              role="option"
              aria-selected={scheme.name === s.name}
              title={s.label}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: s.preview }}
                aria-hidden="true"
              />
              <span className="flex-1">{s.label}</span>
              {scheme.name === s.name && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
