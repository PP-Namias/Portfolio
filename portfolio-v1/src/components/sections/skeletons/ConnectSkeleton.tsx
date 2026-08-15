export function ConnectSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-10 w-44 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
