'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-5 shadow-sm shadow-slate-900/[0.04] dark:shadow-none transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out',
        hover && 'hover:border-accent-pink/40 dark:hover:border-accent-pink/30 hover:shadow-lg hover:shadow-accent-pink/5 hover:-translate-y-1',
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
