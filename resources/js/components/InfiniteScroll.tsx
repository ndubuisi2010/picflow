import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

interface InfiniteScrollProps {
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({ hasMore, loadMore, isLoading, children }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="py-8 text-center">
          {isLoading ? (
            <div className="text-muted-foreground">Loading more photos...</div>
          ) : (
            <div className="h-10" /> // Invisible trigger
          )}
        </div>
      )}
      {!hasMore && !isLoading && (
        <div className="py-8 text-center text-muted-foreground">
          No more photos
        </div>
      )}
    </>
  );
}