<?php

namespace App\Providers;

use App\Models\PhotoComment;
use App\Models\PhotoLike;
use App\Observers\PhotoCommentObserver;
use App\Observers\PhotoLikeObserver;
use App\Services\PhotoService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
       $this->app->singleton(PhotoService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        PhotoLike::observe(PhotoLikeObserver::class);
    PhotoComment::observe(PhotoCommentObserver::class);
    }
}
