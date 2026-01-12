// @/components/photo/photo-dialog.tsx
import Modal from "@/components/my-modal";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  Tag,
} from 'lucide-react';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';

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

interface PhotoDialogProps {
  photo: Photo | null;
  isLiked: boolean;
  onLikeToggle: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}

export function PhotoDialog({
  photo,
  isLiked,
  onLikeToggle,
  open,
  setOpen,
  onClose,
}: PhotoDialogProps) {
  const [optimisticLikes, setOptimisticLikes] = useState(photo?.likes_count);
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);

  // keep optimistic state in sync when photo changes
  useEffect(() => {
    setOptimisticLikes(photo?.likes_count);
    setOptimisticIsLiked(isLiked);
  }, [photo, isLiked]);

  const handleLike = () => {
    setOptimisticIsLiked(!optimisticIsLiked);
    setOptimisticLikes(prev =>
      optimisticIsLiked ? (prev ?? 0) - 1 : (prev ?? 0) + 1
    );
    onLikeToggle();
  };

 const handleDownload = () => {
  if (!photo) return;

  const link = document.createElement("a");
  link.href = photo.storage_path;
  link.target = "_blank";
  link.download = photo.title
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase() + ".jpg";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  if (!photo) return null;

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
      title={photo.title}
    >
      <div className="h-[70vh] overflow-y-auto">
        {/* Image */}
        <div className="bg-black flex items-center justify-center overflow-hidden">
          <img
            src={photo.storage_path}
            alt={photo.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Sidebar Details */}
        <div className="bg-background dark:bg-gray-900 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold mb-2">{photo.title}</h2>
              {photo.caption && (
                <p className="text-lg text-muted-foreground">
                  {photo.caption}
                </p>
              )}
            </div>

            {/* Creator */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{photo.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">
                  {photo.creator.name}
                </p>
                {photo.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {photo.location}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant={optimisticIsLiked ? 'default' : 'outline'}
                size="lg"
                onClick={handleLike}
                className="flex-1"
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${
                    optimisticIsLiked && 'fill-current'
                  }`}
                />
                {optimisticLikes} Likes
              </Button>

              <Button variant="secondary" size="lg" onClick={handleDownload}>
                <Download className="mr-2 h-5 w-5" />
                Download
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{photo.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>{photo.comments_count} comments</span>
              </div>
            </div>

            {/* Tags */}
            {photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photo.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Comments */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">
                Comments ({photo.comments_count})
              </h3>
              <p className="text-muted-foreground text-sm">
                Comment system coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
