<?php

namespace App\Observers;

use App\Models\PhotoComment;

class PhotoCommentObserver
{
    public function created(PhotoComment $comment): void
    {
        $comment->photo->increment('comments_count');
    }

    public function deleted(PhotoComment $comment): void
    {
        $comment->photo->decrement('comments_count');
    }
}