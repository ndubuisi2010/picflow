// @/components/skeletons/PhotoTableSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function PhotoTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full bg-card">
        <thead className="border-b bg-muted/50 whitespace-nowrap">
          <tr>
            <th className="pl-4 w-8 py-3">
              <Skeleton className="h-5 w-5 rounded" />
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-foreground">Photo</th>
            <th className="p-4 text-left text-[13px] font-semibold text-foreground">Title</th>
            <th className="p-4 text-left text-[13px] font-semibold text-foreground">Views</th>
            <th className="p-4 text-left text-[13px] font-semibold text-foreground">Likes</th>
            <th className="p-4 text-left text-[13px] font-semibold text-foreground">Comments</th>
            <th className="p-4 text-left text-[13px] font-semibold text-foreground">Rating</th>
            <th className="p-4 text-left text-[13px] font-semibold text-foreground">Action</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-muted/30' : ''}>
              <td className="pl-4 w-8 py-4">
                <Skeleton className="h-5 w-5 rounded" />
              </td>
              <td className="p-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-48 rounded" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-20 rounded" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-16 rounded" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-16 rounded" />
              </td>
              <td className="p-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Skeleton key={starIdx} className="h-4 w-4 rounded" />
                  ))}
                </div>
              </td>
              <td className="p-4">
                <Skeleton className="h-8 w-8 rounded-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}