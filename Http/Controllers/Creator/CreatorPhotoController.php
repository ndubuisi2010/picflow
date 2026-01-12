<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Http\Requests\PhotoStoreRequest;
use App\Http\Requests\PhotoUpdateRequest;
use App\Http\Requests\StorePhotoRequest;
use App\Http\Requests\UpdatePhotoRequest;
use App\Models\Photo;
use App\Services\PhotoService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CreatorPhotoController extends Controller
{
    protected $photoService;

    public function __construct(PhotoService $photoService)
    {
        $this->photoService = $photoService;
    }

    public function index()
    {
        $user = Auth::user();
        $photos = Photo::where('creator_id', $user->id)->latest()->paginate(15);

        return Inertia::render('Creator/Photos/Index', ['photos' => $photos]);
    }

    public function create()
    {
        return Inertia::render('Creator/Photos/Create');
    }

    public function store(StorePhotoRequest $request)
    {
        $photo = $this->photoService->processUpload($request->validated(), Auth::user());

        return redirect()->route('creator.photos.index')->with('message', 'Photo uploaded');
    }

    public function edit(Photo $photo)
    {
        // $this->authorize('update', $photo);
        return Inertia::render('Creator/Photos/Edit', ['photo' => $photo]);
    }

    public function update(UpdatePhotoRequest $request, Photo $photo)
    {
        // $this->authorize('update', $photo);
        $photo->update($request->validated());

        return redirect()->route('creator.photos.index')->with('message', 'Photo updated');
    }

    public function destroy(Photo $photo)
    {
        // $this->authorize('delete', $photo);
        $photo->delete();

        return back()->with('message', 'Photo deleted');
    }
}