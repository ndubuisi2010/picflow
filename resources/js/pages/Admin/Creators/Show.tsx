import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Eye, Heart, MessageCircle } from 'lucide-react';
import { index } from '@/routes/admin/creators';
import { Button } from '@/components/ui/button';

interface Photo {
  id: number;
  title: string;
  image_url: string;
  views: number;
  likes: number;
  comments_count: number;
}

interface Creator {
  id: number;
  name: string;
  email: string;
  creator_status: 'pending' | 'active' | 'suspended';
  created_at: string;
}

interface ShowCreatorProps {
  creator: Creator;
  stats: {
    total_photos: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    joined_at: string;
  };
  recentPhotos: Photo[];
}

export default function ShowCreator({ creator, stats, recentPhotos }: ShowCreatorProps) {
  return (
    <AdminLayout header={`Creator: ${creator.name}`}>
      <Head title={creator.name} />

      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{creator.name}</h2>
            <p className="text-muted-foreground">{creator.email}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href={index()}>← Back to Creators</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_photos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_likes.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Badge
                variant={
                  creator.creator_status === 'active'
                    ? 'default'
                    : creator.creator_status === 'pending'
                    ? 'secondary'
                    : 'destructive'
                }
                className="capitalize"
              >
                {creator.creator_status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Joined {stats.joined_at}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Latest photos uploaded by this creator</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPhotos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recentPhotos.map((photo) => (
                  <div key={photo.id} className="group cursor-pointer">
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                      <img
                        src={photo.storage_path}
                        alt={photo.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                        <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                        <div className="flex justify-between text-xs text-white/80 mt-1">
                          <span>{photo.views} views</span>
                          <span>{photo.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}