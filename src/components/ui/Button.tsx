'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  internal?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  internal = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark';

  const variants = {
    primary:
      'bg-accent-pink text-white hover:bg-accent-pink-hover active:bg-pink-800 shadow-sm',
    ghost:
      'text-text-primary-light dark:text-text-primary-dark bg-surface-light/50 dark:bg-card-bg-dark/50 hover:bg-surface-light dark:hover:bg-card-bg-dark',
    outline:
      'border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:border-accent-pink hover:text-accent-pink dark:hover:border-accent-pink dark:hover:text-accent-pink',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (href && internal) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
