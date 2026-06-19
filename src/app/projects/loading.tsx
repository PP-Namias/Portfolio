export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-surface-light dark:bg-surface-dark" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-surface-light dark:bg-surface-dark" />
          ))}
        </div>
      </div>
    </div>
  );
}
