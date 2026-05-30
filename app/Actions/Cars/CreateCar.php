<?php

namespace App\Actions\Cars;

use App\Models\Car;
use App\Models\User;

class CreateCar
{
    /**
     * @param  array{name: string, registration_number: string, is_electric: bool}  $data
     */
    public function handle(User $user, array $data): Car
    {
        return $user->cars()->create($data);
    }
}
