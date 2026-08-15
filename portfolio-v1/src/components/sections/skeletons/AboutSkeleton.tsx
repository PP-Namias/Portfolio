export function AboutSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
