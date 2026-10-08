<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string $email
 * @property-read CarbonInterface|null $email_verified_at
 * @property-read string $password
 * @property-read string|null $remember_token
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
#[Fillable([
    'name',
    'email',
    'password',
])]
#[Hidden([
    'password',
    'remember_token',
])]
final class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use Notifiable;

    /**
     * Every car the user can access, as either owner or co-driver.
     *
     * @return BelongsToMany<Car, $this, CarUser>
     */
    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->using(CarUser::class)->withPivot('role')->withTimestamps();
    }

    /**
     * @return BelongsToMany<Car, $this, CarUser>
     */
    public function ownedCars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->using(CarUser::class)->withPivot('role')->withTimestamps()->wherePivot('role', 'owner');
    }

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
