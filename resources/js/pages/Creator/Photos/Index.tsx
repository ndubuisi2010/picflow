import { useState } from 'react';
import CreatorLayout from '@/layouts/creator-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InfiniteScroll from '@/components/InfiniteScroll';
import { create, destroy, index } from '@/routes/creator/photos';
import { Grid3x3, Table as TableIcon } from 'lucide-react';
import { show } from '@/routes/photos';
import { SimpleDropdown } from '@/components/ui/simple-dropdown';
import { AppModal } from '@/components/modal';

interface Photo {
  id: number;
  storage_path: string;
  title: string;
  caption: string | null;
  views: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface PhotosIndexProps {
  photos: {
    data: Photo[];
    current_page: number;
    last_page: number;
  };
}

type ViewMode = 'table' | 'grid';

export default function CreatorPhotosIndex({ photos: initialPhotos }: PhotosIndexProps) {
  const [photos, setPhotos] = useState(initialPhotos.data);
  const [page, setPage] = useState(initialPhotos.current_page);
  const [hasMore, setHasMore] = useState(initialPhotos.current_page < initialPhotos.last_page);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
const [deleteModal, setDeleteModal] = useState(false)
const [selectedId,setSelectedId] = useState<number | null>(null)

const ShouldDelete = (id : number) => {
setSelectedId(id)
setDeleteModal(true)
}
const CancleDelete = () => {
setSelectedId(null)
setDeleteModal(false)
}
  const loadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    router.get(
      index(),
      { page: page + 1 },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['photos'],
        onSuccess: (pageProps: any) => {
          const newPhotos = pageProps.props.photos.data;
          setPhotos((prev) => [...prev, ...newPhotos]);
          setPage(pageProps.props.photos.current_page);
          setHasMore(pageProps.props.photos.current_page < pageProps.props.photos.last_page);
          setIsLoading(false);
        },
      }
    );
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 inline ${i < count ? 'fill-yellow-400' : 'fill-gray-300'}`}
        viewBox="0 0 14 13"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
      </svg>
    ));
  };

  return (
    <CreatorLayout header="My Photos">
      <Head title="My Photos" />

      <div className="space-y-6 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Photos</h1>
            <p className="text-muted-foreground">Manage your uploaded photos</p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex rounded-lg border bg-muted p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button asChild>
              <Link href={create()}>Upload New Photo</Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <InfiniteScroll hasMore={hasMore} loadMore={loadMore} isLoading={isLoading}>
          {viewMode === 'table' ? (
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full bg-card">
                <thead className="border-b bg-muted/50 whitespace-nowrap">
                  <tr>
                    <th className="pl-4 w-8 py-3">
                      <input id="select-all" type="checkbox" className="hidden peer" />
                      <label
                        htmlFor="select-all"
                        className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-blue-500 border border-gray-400 rounded overflow-hidden"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                          <path d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z" />
                        </svg>
                      </label>
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
                  {photos.map((photo, i) => (
                    <tr key={photo.id} className={i % 2 === 1 ? 'bg-muted/30' : ''}>
                      <td className="pl-4 w-8 py-3">
                        <input id={`checkbox-${photo.id}`} type="checkbox" className="hidden peer" />
                        <label
                          htmlFor={`checkbox-${photo.id}`}
                          className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-blue-500 border border-gray-400 rounded overflow-hidden"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                            <path d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z" />
                          </svg>
                        </label>
                      </td>
                      <td className="p-4">
                        <img
                          src={photo.storage_path}
                          alt={photo.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 text-sm font-medium">{photo.title}</td>
                      <td className="p-4 text-sm">{photo.views.toLocaleString()}</td>
                      <td className="p-4 text-sm">{photo.likes_count}</td>
                      <td className="p-4 text-sm">{photo.comments_count}</td>
                      <td className="p-4">{renderStars(Math.round((photo.likes_count / Math.max(photo.views, 1)) * 5))}</td>
                      <td className="p-4">
                        <SimpleDropdown
                        trigger={ <Button variant="ghost" size="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-500 rotate-90" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="4" cy="12" r="2" />
                            <circle cx="20" cy="12" r="2" />
                          </svg>
                        </Button>}
                        items={[
                           {
                            type:"link",
                            label:"Edit",
                            href: `/creator/photos/${photo.id}/edit`,

                           },
                           {
                            type:"action",
                            label:"Delete",
                            onClick: () => ShouldDelete(photo.id),

                           },
                        ]}
                        />
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Grid View
           <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
  {photos.map((photo) => (
    <div
      key={photo.id}
      className="break-inside-avoid group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Link */}
      <Link href={show(photo.id)} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={photo.storage_path}
            alt={photo.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover Overlay - Title & Stats */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
            <h3 className="text-white font-bold text-lg line-clamp-2">
              {photo.title}
            </h3>
            {photo.caption && (
              <p className="text-white/80 text-sm mt-1 line-clamp-2">
                {photo.caption}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{photo.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{photo.likes_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{photo.comments_count}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Dropdown - Top Right */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <SimpleDropdown
          trigger={
            <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="2" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
              </svg>
            </Button>
          }
          items={[
            {
              type: "link",
              label: "Edit",
              href: `/creator/photos/${photo.id}/edit`,
            },
            {
              type: "separator",
            },
            {
              type: "action",
              label: "Delete",
              onClick: () => ShouldDelete(photo.id),
              className: "text-red-600 hover:bg-red-50",
            },
          ]}
        />
      </div>

      {/* Optional: Location tag */}
      {photo.location && (
        <div className="absolute top-3 left-3">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
            {photo.location}
          </span>
        </div>
      )}
    </div>
  ))}
</div>
          )}
        </InfiniteScroll>
      </div>
       <AppModal
            open={deleteModal}
            title='Confirm Deletion of Photo'
            description='You are About Deleting this Photo, Are you sure you want to do so?'
            onOpenChange={() => CancleDelete() }
            onConfirm={() => router.delete(destroy(Number(selectedId)))}
            > 
            </AppModal>
    </CreatorLayout>
  );
}