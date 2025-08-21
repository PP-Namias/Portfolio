'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TwoColumnLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  className?: string;
}

export const TwoColumnLayout = ({ leftContent, rightContent, className = '' }: TwoColumnLayoutProps) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {leftContent}
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {rightContent}
        </motion.div>
      </div>
    </div>
  );
};
