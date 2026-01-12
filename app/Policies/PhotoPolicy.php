<?php

namespace App\Policies;

use App\Models\Photo;
use App\Models\User;

class PhotoPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('consumer') || $user->hasRole('creator') || $user->hasRole('admin');
    }

    public function view(User $user, Photo $photo): bool
    {
        return true; // Public for consumers, but can add checks if needed
    }

    public function create(User $user): bool
    {
        return $user->hasRole('creator') && $user->creator_status === 'active';
    }

    public function update(User $user, Photo $photo): bool
    {
        return $user->id === $photo->creator_id || $user->hasRole('admin');
    }

    public function delete(User $user, Photo $photo): bool
    {
        return $user->id === $photo->creator_id || $user->hasRole('admin');
    }

    public function flag(User $user, Photo $photo): bool
    {
        return $user->hasRole('admin');
    }
}