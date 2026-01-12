<?php

namespace App\Services;

use App\Models\Photo;
use App\Models\PhotoComment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoService
{
    public function processUpload(array $data, $user): Photo
    {
        // Optional: Image optimization (e.g., resize with Intervention Image)
        // $image = Image::make(Storage::get($data['storage_path']));
        // $image->resize(1200, null, function ($constraint) { $constraint->aspectRatio(); });
        // $optimizedPath = 'photos/optimized/' . Str::uuid() . '.jpg';
        // Storage::put($optimizedPath, $image->encode('jpg', 80));

        $data['storage_path'] = $data['storage_path']; // or optimizedPath
        $data['creator_id'] = $user->id;

        return Photo::create($data);
    }

    public function toggleLike(Photo $photo, $user): bool
    {
        $like = $photo->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            return false; // Unliked
        }

        $photo->likes()->create(['user_id' => $user->id]);
        return true; // Liked
    }

    public function addComment($photo, $user, string $content): PhotoComment
    {
        // dd( $content, $photo,$user );
        return PhotoComment::create([
       
            'user_id' => $user->id,
            'content' => $content,
            'photo_id' => $photo
     
        ]);
       
    }

    // Optimization: Cache popular photos (for consumer feed)
    public function getPopularPhotos(int $limit = 10)
    {
        return Photo::with(['comments.user','creator'])
                        ->orderBy('likes_count', 'desc')
                        ->paginate($limit);
    }
}