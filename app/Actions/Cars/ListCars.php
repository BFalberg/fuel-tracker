<?php

namespace App\Actions\Cars;

use App\Models\Car;
use Illuminate\Database\Eloquent\Collection;

class ListCars
{
    public function handle(): Collection
    {
        return Car::latest()
            ->with('user:id,name')
            ->get(['id', 'name', 'registration_number', 'is_electric', 'user_id']);
    }
}
