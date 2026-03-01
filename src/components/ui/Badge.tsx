'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'sky' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    teal: 'bg-accent-pink text-white border-accent-pink',
    sky: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
    default:
      'bg-surface-light dark:bg-card-bg-dark text-text-muted-light dark:text-text-muted-dark border-border-light dark:border-border-dark',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
