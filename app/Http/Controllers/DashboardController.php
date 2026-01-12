<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\User;
use App\Services\PhotoService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController
{
    protected $photoService;

    public function __construct(PhotoService $photoService)
    {
        $this->photoService = $photoService;
    }

    public function dashboard()
    {
        $user = auth()->user();
        $user->loadMissing('roles');

        $photos = $this->photoService->getPopularPhotos();

        /*
        |--------------------------------------------------------------------------
        | ADMIN DASHBOARD — GLOBAL CREATOR ANALYTICS
        |--------------------------------------------------------------------------
        */
        if ($user->hasRole('admin')) {

            $now = Carbon::now('UTC');
            $startDate = $now->copy()->subMonths(11)->startOfMonth();

            // Get all users who are creators
            $creators = User::whereHas('roles', function ($q) {
                $q->where('name', 'creator');
            });

            // Count total creators and consumers
            $totalCreators = (clone $creators)->count();
            $totalConsumers = User::whereHas('roles', function ($q) {
                $q->where('name', 'consumer');
            })->count();

            // Base query: photos for all creators
            $creatorPhotos = Photo::whereIn('creator_id', $creators->pluck('id'));

            // Global stats
            $totalPhotos   = (clone $creatorPhotos)->count();
            $totalViews    = (clone $creatorPhotos)->sum('views');
            $totalLikes    = (clone $creatorPhotos)->sum('likes_count');
            $totalComments = (clone $creatorPhotos)->sum('comments_count');

            // Monthly aggregation
            $monthlyData = [];
            for ($i = 0; $i < 12; $i++) {
                $monthStart = $startDate->copy()->addMonths($i)->startOfMonth();
                $monthEnd   = $monthStart->copy()->endOfMonth();

                $monthQuery = (clone $creatorPhotos)
                    ->whereBetween('created_at', [$monthStart, $monthEnd]);

                $monthlyData[] = [
                    'month'    => $monthStart->format('M Y'),
                    'photos'   => $monthQuery->count(),
                    'views'    => $monthQuery->sum('views'),
                    'likes'    => $monthQuery->sum('likes_count'),
                    'comments' => $monthQuery->sum('comments_count'),
                ];
            }

            // Top 10 photos across all creators
            $topPhotos = (clone $creatorPhotos)
                ->with('creator:id,name')
                ->select(
                    'id',
                    'creator_id',
                    'title',
                    'storage_path as thumbnail',
                    'views',
                    'likes_count',
                    'comments_count'
                )
                ->orderByDesc('views')
                ->limit(10)
                ->get();

            return Inertia::render('admin-dashboard', [
                'photos' => $photos,
                'stats' => [
                    'totalCreators'  => $totalCreators,
                    'totalConsumers' => $totalConsumers,
                    'totalPhotos'    => $totalPhotos,
                    'totalViews'     => $totalViews,
                    'totalLikes'     => $totalLikes,
                    'totalComments'  => $totalComments,
                ],
                'monthlyData' => $monthlyData,
                'topPhotos'   => $topPhotos,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | CREATOR DASHBOARD — SINGLE CREATOR
        |--------------------------------------------------------------------------
        */
        if ($user->hasRole('creator')) {

            $now = Carbon::now('UTC');
            $startDate = $now->copy()->subMonths(11)->startOfMonth();

            $totalPhotos   = $user->photos()->count();
            $totalViews    = $user->photos()->sum('views');
            $totalLikes    = $user->photos()->sum('likes_count');
            $totalComments = $user->photos()->sum('comments_count');

            $monthlyData = [];
            for ($i = 0; $i < 12; $i++) {
                $monthStart = $startDate->copy()->addMonths($i)->startOfMonth();
                $monthEnd   = $monthStart->copy()->endOfMonth();

                $query = $user->photos()
                    ->whereBetween('created_at', [$monthStart, $monthEnd]);

                $monthlyData[] = [
                    'month'    => $monthStart->format('M Y'),
                    'photos'   => $query->count(),
                    'views'    => $query->sum('views'),
                    'likes'    => $query->sum('likes_count'),
                    'comments' => $query->sum('comments_count'),
                ];
            }

            $topPhotos = $user->photos()
                ->select(
                    'id',
                    'title',
                    'storage_path as thumbnail',
                    'views',
                    'likes_count',
                    'comments_count'
                )
                ->orderByDesc('views')
                ->limit(10)
                ->get();

            return Inertia::render('creator-dashboard', [
                'photos'        => $photos,
                'totalPhotos'   => $totalPhotos,
                'totalViews'    => $totalViews,
                'totalLikes'    => $totalLikes,
                'totalComments' => $totalComments,
                'monthlyData'   => $monthlyData,
                'topPhotos'     => $topPhotos,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | CONSUMER DASHBOARD
        |--------------------------------------------------------------------------
        */
        return Inertia::render('consumer-dashboard', [
            'photos' => $photos,
        ]);
    }
}
