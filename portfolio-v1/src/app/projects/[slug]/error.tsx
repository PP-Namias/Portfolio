'use client'

export default function ProjectSlugError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 lg:pt-12">
      <div className="text-center py-12">
        <h1 className="text-xl font-semibold mb-2">Something went wrong loading this project</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-4">{error.message}</p>
        <button type="button" onClick={reset} className="px-4 py-2 rounded-lg bg-accent text-white">
          Try again
        </button>
      </div>
    </div>
  )
}
