<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final readonly class CreateCar
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(User $user, array $attributes): Car
    {
        return DB::transaction(function () use ($user, $attributes): Car {
            $car = Car::query()->create($attributes);
            $car->users()->attach($user->id, ['role' => 'owner']);

            return $car;
        });
    }
}
