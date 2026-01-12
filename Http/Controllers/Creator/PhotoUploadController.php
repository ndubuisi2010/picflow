<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class PhotoUploadController extends Controller
{
    protected $uploadPath = 'photos';

    public function init(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'size' => 'required|integer',
            'mime' => 'required|string',
            'replace' => 'boolean',
            'old_path' => 'nullable|string',
        ]);

        // Delete old file if replacing
        if ($request->replace && $request->old_path) {
            Storage::disk('public')->delete($request->old_path);
        }

        $uploadId = Str::uuid();
        $chunkSize = 1024 * 1024; // 1MB chunks

        // Store upload metadata temporarily (you can use cache or DB)
        cache()->put("upload:{$uploadId}", [
            'filename' => $request->filename,
            'size' => $request->size,
            'mime' => $request->mime,
            'chunks' => [],
            'user_id' => Auth::id(),
        ], now()->addHours(24));

        return response()->json([
            'upload_id' => $uploadId,
            'chunk_size' => $chunkSize,
        ]);
    }

    public function chunk(Request $request)
    {
        $request->validate([
            'upload_id' => 'required|string',
            'chunk_index' => 'required|integer',
            'total_chunks' => 'required|integer',
            'file' => 'required|file',
        ]);

        $uploadId = $request->upload_id;
        $meta = cache()->get("upload:{$uploadId}");

        if (!$meta || $meta['user_id'] !== Auth::id()) {
            abort(404);
        }

        $chunkPath = "temp/{$uploadId}/chunk_{$request->chunk_index}";
        $request->file('file')->storeAs($chunkPath, '', 'local');

        $meta['chunks'][$request->chunk_index] = true;
        cache()->put("upload:{$uploadId}", $meta);

        return response()->json(['success' => true]);
    }

    public function complete(Request $request)
    {
        $request->validate([
            'upload_id' => 'required|string',
            'filename' => 'required|string',
            'total_chunks' => 'required|integer',
        ]);

        $uploadId = $request->upload_id;
        $meta = cache()->get("upload:{$uploadId}");

        if (!$meta || $meta['user_id'] !== Auth::id()) {
            abort(404);
        }

        // Merge chunks
        $finalPath = $this->uploadPath . '/' . Str::random(40) . '.' . pathinfo($meta['filename'], PATHINFO_EXTENSION);
        $fullPath = storage_path('app/public/' . $finalPath);

        // Ensure directory exists
        if (!is_dir(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0755, true);
        }

        $fp = fopen($fullPath, 'wb');
        for ($i = 0; $i < $request->total_chunks; $i++) {
            $chunkFile = storage_path("app/local/temp/{$uploadId}/chunk_{$i}");
            if (file_exists($chunkFile)) {
                fwrite($fp, file_get_contents($chunkFile));
                unlink($chunkFile);
            }
        }
        fclose($fp);

        // Cleanup
        @rmdir(storage_path("app/local/temp/{$uploadId}"));
        cache()->forget("upload:{$uploadId}");

        $url = asset('storage/' . $finalPath);

        return response()->json(['url' => $finalPath]); // store path in DB
    }

    public function deleteFile(Request $request)
    {
        $request->validate(['path' => 'required|string']);
        $user = Auth::user();

        // Optional: check if path belongs to user
        if (Storage::disk('public')->exists($request->path)) {
            Storage::disk('public')->delete($request->path);
        }

        return response()->json(['success' => true]);
    }
}