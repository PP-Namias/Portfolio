'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';

export function Footer() {
  return (
    <motion.footer
      className="mt-16 pb-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
