<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\CarExpense;

final readonly class CreateCarExpense
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Car $car, array $attributes): CarExpense
    {
        return $car->carExpenses()->create($attributes);
    }
}
