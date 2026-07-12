export function ExperienceSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />
            </div>
            <div className="flex-1 pb-6">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="space-y-1">
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}
