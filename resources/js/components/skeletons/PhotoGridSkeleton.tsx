// @/components/skeletons/PhotoGridSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function PhotoGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="break-inside-avoid">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}