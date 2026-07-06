<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->withPivot('role')->withTimestamps();
    }

    public function ownedCars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->withPivot('role')->withTimestamps()->wherePivot('role', 'owner');
    }

    public function accessibleCars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->withPivot('role')->withTimestamps();
    }
}
