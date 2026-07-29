export default function TechnicianCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
      {/* Image */}
      <div className="aspect-4/3 animate-pulse bg-muted" />

      {/* Content */}
      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />

          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>

        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />

          <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />

          <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="flex items-end justify-between border-t border-border/60 pt-4">
          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />

            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}