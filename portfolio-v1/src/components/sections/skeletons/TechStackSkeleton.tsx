export function TechStackSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}
