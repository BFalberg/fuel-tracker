<?php

namespace App\Actions\Cars;

use App\Models\Car;

class DeleteCar
{
    public function handle(Car $car): void
    {
        $car->delete();
    }
}
