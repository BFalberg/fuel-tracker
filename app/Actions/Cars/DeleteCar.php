<?php

declare(strict_types=1);

namespace App\Actions\Cars;

use App\Models\Car;

final class DeleteCar
{
    public function handle(Car $car): void
    {
        $car->delete();
    }
}
