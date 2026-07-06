<?php

namespace App\Actions\Cars;

use App\Models\Car;
use Illuminate\Database\Eloquent\Collection;

class ListCars
{
    public function handle(): Collection
    {
        return Car::latest()
            ->get(['id', 'name', 'registration_number', 'is_electric']);
    }
}
