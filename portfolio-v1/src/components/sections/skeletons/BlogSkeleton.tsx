export function BlogSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg">
            <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-2">
                <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
