<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\User;

final readonly class CreateCarUser
{
    public function handle(Car $car, User $user): void
    {
        $car->users()->attach($user->id, ['role' => 'co_driver']);
    }
}
