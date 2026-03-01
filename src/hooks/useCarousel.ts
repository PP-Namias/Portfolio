'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseCarouselOptions {
  totalItems: number;
  autoAdvanceInterval?: number;
}

export function useCarousel({ totalItems, autoAdvanceInterval = 6000 }: UseCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  useEffect(() => {
    if (isHovered || totalItems <= 1) return;

    intervalRef.current = setInterval(() => {
      goNext();
    }, autoAdvanceInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, goNext, autoAdvanceInterval, totalItems]);

  return {
    currentIndex,
    goTo,
    goNext,
    goPrev,
    setIsHovered,
  };
}
