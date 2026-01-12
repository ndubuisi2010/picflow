<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Models\Photo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;

class CreatorManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::whereHas('roles', fn($q) => $q->where('name', 'creator'))
                     ->withCount(['photos'])
                     ->with('photos');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('creator_status', $request->status);
        }

        $creators = $query->orderBy('created_at', 'desc')
                          ->paginate(15)
                          ->withQueryString();

        return Inertia::render('Admin/Creators/Index', [
            'creators' => $creators,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Creators/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
            'creator_status' => 'pending', // starts as pending
        ]);

        $creatorRole = Role::where('name', 'creator')->firstOrFail();
        $user->roles()->attach($creatorRole);

        return redirect()->route('admin.creators.index')
                         ->with('message', 'Creator created successfully. Awaiting approval.');
    }

    public function show(User $creator): Response
{
    // ==========================
    // Recent Photos (Top 10)
    // ==========================
    $recentPhotos = $creator->photos()
        ->withCount(['likes', 'comments'])
        ->latest()
        ->take(10)
        ->get();

    // ==========================
    // Stats (Aggregated Properly)
    // ==========================
    $totalPhotos = $creator->photos()->count();

    $totalViews = $creator->photos()->sum('views');

    $totalLikes = $creator->photos()
        ->join('photo_likes', 'photos.id', '=', 'photo_likes.photo_id')
        ->count();

    $totalComments = $creator->photos()
        ->join('photo_comments', 'photos.id', '=', 'photo_comments.photo_id')
        ->count();

    $stats = [
        'total_photos'   => $totalPhotos,
        'total_views'    => $totalViews,
        'total_likes'    => $totalLikes,
        'total_comments' => $totalComments,
        'joined_at'      => $creator->created_at->format('M d, Y'),
    ];

    return Inertia::render('Admin/Creators/Show', [
        'creator'      => $creator,
        'stats'        => $stats,
        'recentPhotos' => $recentPhotos,
    ]);
}
    public function updateStatus(Request $request, User $creator)
    {
        $request->validate([
            'creator_status' => 'required|in:pending,active,suspended'
        ]);

        $creator->update(['creator_status' => $request->creator_status]);

        return back()->with('message', "Creator status updated to {$request->creator_status}");
    }

    public function destroy(User $creator)
    {
        $creator->delete(); // soft delete

        return redirect()->route('admin.creators.index')
                         ->with('message', 'Creator deleted successfully');
    }
}