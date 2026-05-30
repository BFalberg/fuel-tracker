<?php

namespace App\Actions\CarExpenses;

use App\Models\Car;
use Illuminate\Database\Eloquent\Collection;

class ListCarExpenses
{
    public function handle(Car $car): Collection
    {
        return $car->carExpenses()->latest()->get();
    }
}
