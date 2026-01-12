<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'creator_status'

    ];
public function roles()
{
    return $this->belongsToMany(Role::class);
}

// public function hasRole(string $role): bool
// {
//     return $this->roles->contains('name', $role);
// }

// public function hasAnyRole(array $roles): bool
// {
//     return $this->roles->whereIn('name', $roles)->isNotEmpty();
// }
public function hasRole(string $role): bool
{
    // Cache roles on the model instance to avoid multiple queries
    return $this->relationLoaded('roles')
        ? $this->roles->pluck('name')->contains($role)
        : $this->roles()->where('name', $role)->exists();
}
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];
public function isConsumer(): bool
    {
        return $this->hasRole('consumer');
    }
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'creator_status' => 'string',
        ];
    }

    public function photos(): HasMany
{
    return $this->hasMany(Photo::class, 'creator_id');
}

public function photoLikes(): HasMany
{
    return $this->hasMany(PhotoLike::class);
}

public function photoComments(): HasMany
{
    return $this->hasMany(PhotoComment::class);
}
}
