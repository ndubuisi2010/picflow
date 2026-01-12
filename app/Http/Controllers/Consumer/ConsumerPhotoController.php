<?php

namespace App\Http\Controllers\Consumer;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentStoreRequest;
use App\Http\Requests\StorePhotoCommentRequest;
use App\Models\Photo;
use App\Services\PhotoService;
use Inertia\Inertia;

class ConsumerPhotoController extends Controller
{
    protected $photoService;

    public function __construct(PhotoService $photoService)
    {
        $this->photoService = $photoService;
    }

    public function index()
    {
        $photos = $this->photoService->getPopularPhotos();

        return Inertia::render('Consumer/Photos/Index', ['photos' => $photos]);
    }

    public function show(Photo $photo)
    {
        $photo->incrementViews();
        $photo->load(['comments.user', 'creator']);

        return Inertia::render('Consumer/Photos/Show', ['photo' => $photo]);
    }

    public function like(Photo $photo)
    {
        $liked = $this->photoService->toggleLike($photo, auth()->user());

        return back()->with('message', $liked ? 'Liked' : 'Unliked');
    }

    public function comment(StorePhotoCommentRequest $request,  $photo)
    {
        $this->photoService->addComment($photo, auth()->user(), $request->content);

        return back()->with('message', 'Comment added');
    }

    public function report(Photo $photo)
    {
        $photo->update(['flagged' => true]);

        return back()->with('message', 'Photo reported');
    }
}