export default function Loading() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-light dark:border-border-dark border-t-accent-pink" />
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Loading...</p>
      </div>
    </div>
  );
}
