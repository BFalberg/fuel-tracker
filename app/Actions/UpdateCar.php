<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;

final readonly class UpdateCar
{
    /**
     * Archiving keeps the original archive date when the car is saved again.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Car $car, array $attributes): Car
    {
        if (array_key_exists('is_archived', $attributes)) {
            $attributes['archived_at'] = $attributes['is_archived'] ? ($car->archived_at ?? now()) : null;
            unset($attributes['is_archived']);
        }

        $car->update($attributes);

        return $car;
    }
}
