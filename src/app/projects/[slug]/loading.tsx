export default function ProjectSlugLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 lg:pt-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-3/4 rounded bg-surface-light dark:bg-surface-dark" />
        <div className="aspect-video rounded-xl bg-surface-light dark:bg-surface-dark" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 rounded bg-surface-light dark:bg-surface-dark" style={{ width: `${90 - i * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
