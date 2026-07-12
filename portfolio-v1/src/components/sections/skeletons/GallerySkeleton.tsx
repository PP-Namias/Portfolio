export function GallerySkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${
              i === 1 ? 'col-span-2 row-span-2' : ''
            }`}
            style={{ minHeight: i === 1 ? '300px' : '150px' }}
          />
        ))}
      </div>
    </div>
  );
}
