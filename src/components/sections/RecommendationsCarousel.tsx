'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { recommendations } from '@/data/recommendations';
import { useCarousel } from '@/hooks/useCarousel';

const PLACEHOLDER_NAMES = ['Sample Recommender', 'Another Recommender'];

function isPlaceholderData() {
  return recommendations.length === 0 ||
    recommendations.every((r) => PLACEHOLDER_NAMES.includes(r.name));
}

export function RecommendationsCarousel() {
  const { currentIndex, goTo, setIsHovered } = useCarousel({
    totalItems: recommendations.length,
    autoAdvanceInterval: 6000,
  });
  const [direction, setDirection] = useState(1);
  const prevIndex = useRef(0);

  useEffect(() => {
    setDirection(currentIndex > prevIndex.current ? 1 : -1);
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  const handleDotClick = (index: number) => {
    setDirection(index > prevIndex.current ? 1 : -1);
    prevIndex.current = index;
    goTo(index);
  };

  if (isPlaceholderData()) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          Recommendations
        </h2>
        <div className="flex flex-col items-center justify-center min-h-[140px] text-center">
          <MessageSquare className="h-8 w-8 text-text-muted-light dark:text-text-muted-dark mb-3 opacity-40" />
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Testimonials coming soon
          </p>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 opacity-60">
            Real recommendations from colleagues and managers
          </p>
        </div>
      </motion.section>
    );
  }

  const current = recommendations[currentIndex];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Recommendations
      </h2>

      <div className="relative overflow-hidden min-h-[140px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <blockquote className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed italic">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <div className="mt-3">
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {current.name}
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                {current.title}, {current.company}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {recommendations.length > 1 && (
        <div className="flex items-center gap-1.5 mt-4">
          {recommendations.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-accent-pink'
                  : 'w-1.5 bg-border-light dark:bg-border-dark hover:bg-text-muted-light dark:hover:bg-text-muted-dark'
              }`}
              aria-label={`Go to recommendation ${index + 1}`}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
