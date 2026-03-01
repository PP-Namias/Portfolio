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
        'rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-5 transition-colors duration-200',
        hover && 'hover:border-accent-pink/30 dark:hover:border-accent-pink/30 hover:shadow-sm',
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
