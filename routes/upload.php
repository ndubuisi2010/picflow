<?php

use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/')->group(function() {
    Route::post('/uploads/init', [UploadController::class, 'init']);
Route::post('/uploads/chunk', [UploadController::class, 'chunk']);
Route::post('/uploads/complete', [UploadController::class, 'complete']);
Route::delete('/uploads/file', [UploadController::class, 'delete']);
});
