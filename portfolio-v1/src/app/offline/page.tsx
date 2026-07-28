export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-accent-pink/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-accent-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 14a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          No internet connection detected. Cached portfolio pages are still available below.
        </p>
        <p className="text-sm text-text-secondary-light/70 dark:text-text-secondary-dark/70">
          Some dynamic content (blog posts, projects) may not be fully up to date.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-pink text-white font-medium hover:bg-accent-pink/90 transition-colors focus-visible:outline-2 focus-visible:outline-accent-pink focus-visible:outline-offset-2"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try again
        </button>
      </div>
    </main>
  );
}
