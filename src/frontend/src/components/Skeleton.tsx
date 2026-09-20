import { Skeleton as BaseSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <BaseSkeleton className={cn("bg-muted", className)} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const ids = Array.from({ length: lines }, (_, i) => `skeleton-line-${i}`);
  return (
    <div className="space-y-2">
      {ids.map((id, index) => (
        <Skeleton
          key={id}
          className={cn("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-card">
      <Skeleton className="mb-4 h-10 w-10 rounded-full" />
      <Skeleton className="mb-3 h-5 w-1/2" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  const ids = Array.from({ length: count }, (_, i) => `skeleton-card-${i}`);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ids.map((id) => (
        <SkeletonCard key={id} />
      ))}
    </div>
  );
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  const ids = Array.from({ length: count }, (_, i) => `skeleton-row-${i}`);
  return (
    <div className="space-y-3">
      {ids.map((id) => (
        <div
          key={id}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}
