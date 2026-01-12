// resources/js/Pages/Consumer/Dashboard.tsx
import { useEffect, useState } from 'react';
import ConsumerLayout from '@/layouts/consumer-layout';
import { Head, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhotoGrid } from '@/components/photo/photo-grid';
import { PhotoCard } from '@/components/photo/photo-card';
import { PhotoDialog } from '@/components/photo/photo-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentModal } from '@/components/photo/comment-modal';
import { CommentDrawer } from '@/components/photo/comment-drawer';

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

interface PaginatedPhotos {
  data: Photo[];
  current_page: number;
  last_page: number;
}

interface DashboardProps {
  photos: PaginatedPhotos;
}

export default function ConsumerDashboard({ photos: initialPhotos }: DashboardProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos.data);
  const [page, setPage] = useState(initialPhotos.current_page);
  const [hasMore, setHasMore] = useState(initialPhotos.current_page < initialPhotos.last_page);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
const [commentModalOpen, setCommentModalOpen] = useState(false);
const [currentComments, setCurrentComments] = useState<{id:number, content:string, user:{name:string}}[]>([]);
const [commentPhotoId, setCommentPhotoId] = useState<number | null>(null);

const handleCommentOpen = (photo: Photo) => {
  console.log(photo);
  
  setCurrentComments(photo.comments || []); // ensure photo.comments is loaded
  setCommentPhotoId(photo.id);
  setCommentModalOpen(true);
};
console.log(photos);

const handleNewComment = (content: string) => {
  if (!commentPhotoId) return;
  setPhotos(prev => prev.map(p => 
    p.id === commentPhotoId ? {...p, comments_count: p.comments_count + 1} : p
  ));
};
  const loadMore = () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    router.get(
      '/dashboard',
      { page: page + 1, search, tag: filterTag, location: filterLocation },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['photos'],
        onSuccess: (props: any) => {
          const newPhotos = props.props.photos.data;
          setPhotos(prev => [...prev, ...newPhotos]);
          setPage(props.props.photos.current_page);
          setHasMore(props.props.photos.current_page < props.props.photos.last_page);
          setIsLoading(false);
        },
      }
    );
  };
useEffect(function() {
  console.log(page);
  
  if (page > 1) {
    setPage(1)
    setPhotos([])
     router.get(
      '/dashboard',
      { page: 1  },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['photos'],
        onSuccess: (props: any) => {
          const newPhotos = props.props.photos.data;
          setPhotos(prev => [...prev, ...newPhotos]);
          setPage(props.props.photos.current_page);
          setHasMore(props.props.photos.current_page < props.props.photos.last_page);
          setIsLoading(false);
        },
      }
    );
  }
}, [])
  const handleLike = (photoId: number) => {
    router.post(`/photos/${photoId}/like`, {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setPhotos(prev => prev.map(p =>
          p.id === photoId
            ? { ...p, liked_by_user: !p.liked_by_user, likes_count: p.liked_by_user ? p.likes_count - 1 : p.likes_count + 1 }
            : p
        ));
      },
    });
  };
const [open, setOpen] = useState(false);
const [Viewedphoto, setViewedPhoto] = useState<Photo | null>(null);
  return (
    <ConsumerLayout header="Discover">
      <Head title="PIXORA - Discover Photos" />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="text-center py-16 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Discover Beautiful Photos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore stunning imagery from talented creators worldwide
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search photos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Input placeholder="Location" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} />
            <Input placeholder="Tag" value={filterTag} onChange={(e) => setFilterTag(e.target.value)} />
            <Button onClick={() => router.reload({ only: ['photos'] })}>Apply Filters</Button>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          {photos.length === 0 && !isLoading ? (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground">No photos found</p>
            </div>
          ) : (
            <PhotoGrid photos={photos} hasMore={hasMore} isLoading={isLoading} loadMore={loadMore}>
              {(photo) => (
               <PhotoCard
  onClick={() => {
    setOpen(true);
    setViewedPhoto(photo);
  }}
  photo={photo}
      onView={() => { setOpen(true); setViewedPhoto(photo); }}
      onLike={() => handleLike(photo.id)}
      onLove={() => router.post(`/photos/${photo.id}/report`)}
      onComment={() => handleCommentOpen(photo)}
>
  <img
    src={photo.storage_path}
    alt={photo.title}
    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
  />
</PhotoCard>

              )}
            </PhotoGrid>
          )}
        </div>
      </div>
      <PhotoDialog
  open={open}
  setOpen={setOpen}
  onClose={() => {
    setOpen(false);
    setViewedPhoto(null);
  }}
  photo={Viewedphoto}
  isLiked={!!Viewedphoto?.liked_by_user}
  onLikeToggle={() => Viewedphoto && handleLike(Viewedphoto.id)}
/>
<CommentDrawer
open={commentModalOpen}
  onClose={() => {
    setCommentModalOpen(false)
    setCommentPhotoId(null)
  }}
  photoId={commentPhotoId!}
  comments={currentComments}
  onNewComment={handleNewComment}
/>
{/* <CommentModal
  open={commentModalOpen}
  onClose={() => {
    setCommentModalOpen(false)
    setCommentPhotoId(null)
  }}
  photoId={commentPhotoId!}
  comments={currentComments}
  onNewComment={handleNewComment}
/> */}
    </ConsumerLayout>
  );
}