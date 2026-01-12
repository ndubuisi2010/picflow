<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Photo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'creator_id',
        'storage_path',
        'title',
        'caption',
        'location',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'flagged' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(PhotoLike::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(PhotoComment::class);
    }

    // Helper: Check if liked by current user (for consumer side)
    public function isLikedBy(User $user): bool
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    // Optimization: Increment views (called on consumer view)
    public function incrementViews(): void
    {
        $this->increment('views');
    }
}