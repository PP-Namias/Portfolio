'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-16">
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent-pink/20 blur-2xl scale-150" />
          <div className="relative rounded-full bg-accent-pink/10 p-6">
            <AlertTriangle className="h-12 w-12 text-accent-pink" />
          </div>
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="max-w-md"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
          Something went wrong
        </h1>
        <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          An unexpected error occurred. You can try again or head back to the homepage.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:border-accent-pink/50 transition-colors"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
