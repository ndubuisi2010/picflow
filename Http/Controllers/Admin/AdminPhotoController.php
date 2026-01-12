<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPhotoController extends Controller
{
    public function index()
    {
        $photos = Photo::with('creator')->where('flagged', true)->paginate(15);

        return Inertia::render('Admin/Photos/Index', ['photos' => $photos]);
    }

    public function destroy(Photo $photo)
    {
        $photo->delete();

        return back()->with('message', 'Photo removed');
    }

    public function flag(Photo $photo, Request $request)
    {
        $photo->update(['flagged' => $request->flagged]);

        return back()->with('message', 'Flag updated');
    }
}