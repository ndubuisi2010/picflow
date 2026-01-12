// @/components/photo/photo-card.tsx
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Heart, MessageCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface PhotoCardProps {
  photo: Photo;
  children: React.ReactNode;
  onView: () => void;
  onLike: () => void;
  onLove: () => void;
  onComment: () => void;
}

export function PhotoCard({ photo, children, onView, onLike, onLove, onComment }: PhotoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 group">
      <div className="relative aspect-square bg-muted cursor-pointer" onClick={onView}>
        {children}
      </div>

      <div className="p-5 bg-background">
        {/* Creator Info */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{photo.creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{photo.creator.name}</p>
              {photo.location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {photo.location}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {photo.tags.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-1">
              {photo.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <Button
            variant={photo.liked_by_user ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); onLike(); }}
          >
            <Heart className="h-4 w-4 mr-1" />
            {photo.likes_count} Like
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); onLove(); }}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Love
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); onComment(); }}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {photo.comments_count} Comment
          </Button>
        </div>
      </div>
    </Card>
  );
}
