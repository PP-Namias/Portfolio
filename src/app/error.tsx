'use client';

import { useEffect } from 'react';

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
        Something went wrong
      </h1>
      <p className="mt-4 text-base text-text-secondary-light dark:text-text-secondary-dark">
        An unexpected error occurred.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
