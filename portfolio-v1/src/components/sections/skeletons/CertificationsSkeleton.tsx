export function CertificationsSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
            <div className="p-2 space-y-1">
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
