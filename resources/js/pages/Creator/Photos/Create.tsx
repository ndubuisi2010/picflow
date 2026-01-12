import CreatorLayout from '@/layouts/creator-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/form/file-upload';
import { store, index } from '@/routes/creator/photos';
// import { uploadUrl } from '@/routes/creator/photos';

export default function CreatePhoto() {
  const { data, setData, post, processing, errors } = useForm({
    storage_path: null as string | null,
    title: '',
    caption: '',
    location: '',
    tags: [] as string[],
  });

  const handleUploadChange = (url: string | null) => {
    setData('storage_path', url);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(store(), {
      onSuccess: () => router.visit(index()),
    });
  };

  return (
    <CreatorLayout header="Upload New Photo">
      <Head title="Upload Photo" />

      <div className="  space-y-8 p-5">
        <Card>
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
            <CardDescription>Add a new photo to your gallery</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6 max-w-4xl mx-auto p-4 ">
              <div>
                <Label>Photo</Label>
                <FileUpload
                  uploadUrl={'/api/uploads'}
                  value={data.storage_path}
                  multiple={false}
                  accept={['jpg', 'jpeg', 'png', 'webp']}
                  onChange={handleUploadChange}
                />
                {errors.storage_path && <p className="text-sm text-destructive mt-1">{errors.storage_path}</p>}
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  required
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={data.caption}
                  onChange={(e) => setData('caption', e.target.value)}
                  rows={4}
                /> 
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                  placeholder="e.g. Tokyo, Japan"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={data.tags.join(', ')}
                  onChange={(e) => setData('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="nature, portrait, sunset"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={processing || !data.storage_path}>
                  Upload Photo
                </Button>
                <Button variant="outline" asChild>
                  <Link href={index()}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
}