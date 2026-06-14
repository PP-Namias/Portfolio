import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <p className="text-6xl font-bold text-accent-pink mb-4">404</p>
      <h1 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
        Page not found
      </h1>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-accent-pink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-pink-hover transition-colors"
      >
        &larr; Back to home
      </Link>
    </main>
  );
}
