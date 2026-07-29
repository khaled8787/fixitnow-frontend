export default function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
      {/* Image Skeleton */}
      <div className="aspect-4/3 animate-pulse bg-muted" />

      {/* Content Skeleton */}
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />

        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />

          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <div className="space-y-2">
            <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />

            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}