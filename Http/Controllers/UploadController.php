<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function init(Request $request)
    {
        if ($request->boolean('replace') && $request->old_path) {
            Storage::disk('public')->delete($request->old_path);
        }

        $uploadId = (string) Str::uuid();

        Storage::makeDirectory("chunks/{$uploadId}");

        return response()->json([
            'upload_id'  => $uploadId,
            'chunk_size' => 5 * 1024 * 1024, // 5MB
        ]);
    }

    public function chunk(Request $request)
    {
        $request->validate([
            'upload_id'   => 'required|string',
            'chunk_index' => 'required|integer',
            'file'        => 'required|file',
        ]);

        $path = "chunks/{$request->upload_id}/chunk_{$request->chunk_index}";

        Storage::put($path, $request->file('file')->get());

        return response()->json(['received' => true]);
    }

    public function complete(Request $request)
{
    $request->validate([
        'upload_id'      => 'required|string',
        'filename'       => 'required|string',
        'total_chunks'   => 'required|integer|min:1',
    ]);

    $uploadId     = $request->upload_id;
    $originalName = $request->filename;
    $totalChunks  = (int) $request->total_chunks;

    // -----------------------------
    // Paths
    // -----------------------------
    $chunkDir  = storage_path("app/private/chunks/{$uploadId}");
    $uploadDir = storage_path('app/public/uploads');
// var_dump($chunkDir);
    // Ensure directories exist
    if (!is_dir($chunkDir)) {
        return response()->json([
            'message' => 'Chunk directory not found.',
        ], 404);
    }

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // -----------------------------
    // Final filename
    // -----------------------------
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    $finalName = Str::random(40) . ($extension ? ".{$extension}" : '');
    $finalPath = "{$uploadDir}/{$finalName}";

    // -----------------------------
    // Merge chunks
    // -----------------------------
    $final = fopen($finalPath, 'ab');

    if (!$final) {
        return response()->json([
            'message' => 'Unable to create final file.',
        ], 500);
    }

    try {
        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkPath = "{$chunkDir}/chunk_{$i}";

            if (!file_exists($chunkPath)) {
                fclose($final);

                return response()->json([
                    'message' => "Missing chunk {$i}.",
                ], 422);
            }

            $chunk = fopen($chunkPath, 'rb');

            while (!feof($chunk)) {
                fwrite($final, fread($chunk, 1024 * 1024)); // 1MB buffer
            }

            fclose($chunk);
            unlink($chunkPath);
        }
    } finally {
        // fclose($final);
    }

    // Remove chunk directory
    @rmdir($chunkDir);

    // -----------------------------
    // Public URL
    // -----------------------------
    $publicUrl = asset("storage/uploads/{$finalName}");

    return response()->json([
        'success'   => true,
        'filename'  => $finalName,
        'url'       => $publicUrl,
        'disk_path' => "public/uploads/{$finalName}",
    ]);
}
    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        Storage::disk('public')->delete($request->path);

        return response()->json(['deleted' => true]);
    }
}
