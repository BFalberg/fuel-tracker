<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\User;

final readonly class DeleteCarUser
{
    public function handle(Car $car, User $user): void
    {
        $car->users()->detach($user->id);
    }
}
