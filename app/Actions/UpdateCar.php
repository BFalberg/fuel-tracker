<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;

final readonly class UpdateCar
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Car $car, array $attributes): Car
    {
        $car->update($attributes);

        return $car;
    }
}
