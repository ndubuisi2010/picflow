<?php

use App\Http\Controllers\Admin\AdminPhotoController;
use App\Http\Controllers\Admin\CreatorManagementController;
use App\Http\Controllers\Consumer\ConsumerPhotoController;
use App\Http\Controllers\Creator\CreatorPhotoController;
use App\Http\Controllers\DashboardController;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    $photos = Photo::latest()->take(10)->get(['id', 'title', 'storage_path as thumbnail', 'creator_id']);

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'photos' => $photos,
        "consumer"=> $request->user() && $request->user()->hasRole('consumer')
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class,'dashboard'])->name('dashboard');
});


Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
   
Route::resource('creators', CreatorManagementController::class);
    Route::patch('creators/{creator}/status', [CreatorManagementController::class, 'updateStatus'])
         ->name('creators.update-status');
});

// Consumer Routes (view, like, comment, report)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('photos', [ConsumerPhotoController::class, 'index'])->name('photos.index');
    Route::get('photos/{photo}', [ConsumerPhotoController::class, 'show'])->name('photos.show');
    Route::post('photos/{photo}/like', [ConsumerPhotoController::class, 'like'])->name('photos.like');
    Route::post('photos/{photo}/comment', [ConsumerPhotoController::class, 'comment'])->name('photos.comment');
    Route::post('photos/{photo}/report', [ConsumerPhotoController::class, 'report'])->name('photos.report');
});

// Creator Routes (upload, edit, delete own photos)
Route::middleware(['auth', 'verified', 'role:creator'])->prefix('creator')->name('creator.')->group(function () {
    Route::resource('photos', CreatorPhotoController::class);
});

// Admin Routes (moderate photos, comments)
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('photos', [AdminPhotoController::class, 'index'])->name('photos.index');
    Route::delete('photos/{photo}', [AdminPhotoController::class, 'destroy'])->name('photos.destroy');
    Route::post('photos/{photo}/flag', [AdminPhotoController::class, 'flag'])->name('photos.flag');
    // Comment moderation similar
});

require __DIR__.'/settings.php';
require __DIR__.'/upload.php';