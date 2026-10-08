<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;

final readonly class DeleteCar
{
    public function handle(Car $car): void
    {
        $car->delete();
    }
}
