export function ProjectsSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="h-44 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-2">
                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
