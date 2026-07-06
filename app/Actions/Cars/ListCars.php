<?php

namespace App\Actions\Cars;

use Illuminate\Database\Eloquent\Collection;

class ListCars
{
    public function handle(): Collection
    {
        return auth()->user()->accessibleCars()
            ->with(['users' => fn ($q) => $q->wherePivot('role', 'owner')->select('users.id', 'users.name')])
            ->latest('cars.created_at')
            ->get(['cars.id', 'cars.name', 'cars.registration_number', 'cars.is_electric']);
    }
}
