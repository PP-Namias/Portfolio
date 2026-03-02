'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-pink via-accent-pink-hover-dark to-accent-pink origin-left z-50"
      style={{ scaleX }}
    />
  );
}
