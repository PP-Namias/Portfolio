import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-7xl font-bold bg-gradient-to-r from-accent-pink via-accent-pink-hover-dark to-accent-pink bg-clip-text text-transparent">
        404
      </h1>
      <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
