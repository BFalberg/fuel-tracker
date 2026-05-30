<?php

namespace App\Actions\Cars;

use App\Models\Car;

class UpdateCar
{
    /**
     * @param  array{name: string, registration_number: string, is_electric: bool}  $data
     */
    public function handle(Car $car, array $data): Car
    {
        $car->update($data);

        return $car;
    }
}
