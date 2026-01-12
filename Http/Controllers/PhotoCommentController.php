<?php

namespace App\Http\Controllers;

use App\Models\PhotoComment;
use App\Http\Requests\StorePhotoCommentRequest;
use App\Http\Requests\UpdatePhotoCommentRequest;

class PhotoCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePhotoCommentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PhotoComment $photoComment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PhotoComment $photoComment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePhotoCommentRequest $request, PhotoComment $photoComment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PhotoComment $photoComment)
    {
        //
    }
}
