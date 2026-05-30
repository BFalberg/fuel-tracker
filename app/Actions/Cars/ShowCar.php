<?php

namespace App\Actions\Cars;

use App\Models\Car;
use Closure;
use Illuminate\Database\Eloquent\Collection;

class ShowCar
{
    /**
     * @return array{car: Car, expenses: Closure, refuels: Closure, start_milage: mixed, user: mixed}
     */
    public function handle(Car $car): array
    {
        $car->load('user:id,name');

        return [
            'car' => $car,
            'expenses' => fn (): Collection => $car->carExpenses->sortByDesc('invoice_date')->values(),
            'refuels' => fn (): Collection => $car->refuels,
            'start_milage' => $car->start_milage,
            'user' => $car->user,
        ];
    }
}
