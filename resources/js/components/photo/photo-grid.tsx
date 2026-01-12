// @/components/photo/photo-grid.tsx
import InfiniteScroll from '@/components/InfiniteScroll';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
interface Photo {
  id: number;
  storage_path: string;
  title: string;
  caption: string | null;
  location: string | null;
  tags: string[];
  views: number;
  likes_count: number;
  comments_count: number;
  creator: { id: number; name: string };
  liked_by_user?: boolean;
}

interface PhotoGridProps {
  photos: Photo[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  children: (photo: Photo) => React.ReactNode;
}

export function PhotoGrid({ photos, hasMore, isLoading, loadMore, children }: PhotoGridProps) {
    
  return (
    <InfiniteScroll hasMore={hasMore} loadMore={loadMore} isLoading={isLoading}>
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
        {photos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid">
            {children(photo)}
          </div>
        ))}

        {isLoading && (
          <>
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={`loading-${i}`} className="aspect-square w-full rounded-xl" />
            ))}
          </>
        )}
      </div>
    </InfiniteScroll>
  );
}