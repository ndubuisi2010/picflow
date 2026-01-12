<?php

namespace App\Observers;

use App\Models\PhotoLike;

class PhotoLikeObserver
{
    public function created(PhotoLike $like): void
    {
        $like->photo->increment('likes_count');
    }

    public function deleted(PhotoLike $like): void
    {
        $like->photo->decrement('likes_count');
    }
}