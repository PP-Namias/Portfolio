'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '@/types';

interface TestimonialCardProps {
  recommendation: Recommendation;
  direction: number;
}

export function TestimonialCard({ recommendation, direction }: TestimonialCardProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={recommendation.id}
        custom={direction}
        initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <blockquote className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed italic">
          &ldquo;{recommendation.quote}&rdquo;
        </blockquote>
        <div className="mt-3">
          <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
            {recommendation.name}
          </p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            {recommendation.title}, {recommendation.company}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
