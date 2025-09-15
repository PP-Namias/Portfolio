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
    <div className={`container ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {leftContent}
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {rightContent}
        </motion.div>
      </div>
    </div>
  );
};
