import { Skeleton } from "@/components/ui/Skeleton";

export function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[var(--shadow-card)]">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1.5 pt-0.5">
          <Skeleton className="h-5 w-14 rounded-lg" />
          <Skeleton className="h-5 w-14 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-1 border-t border-gray-100 pt-3">
          <Skeleton className="mx-auto h-8 w-12" />
          <Skeleton className="mx-auto h-8 w-12" />
          <Skeleton className="mx-auto h-8 w-12" />
        </div>
      </div>
    </div>
  );
}
