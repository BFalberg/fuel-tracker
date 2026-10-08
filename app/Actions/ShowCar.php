<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final readonly class ShowCar
{
    /**
     * @return array{car: Car, expenses: Closure(): Collection<int, CarExpense>, refuels: Closure(): Collection<int, Refuel>, start_milage: int|null}
     */
    public function handle(Car $car): array
    {
        $car->load(['users' => fn (BelongsToMany $q): BelongsToMany => $q->wherePivot('role', 'owner')->select('users.id', 'users.name')]);

        return [
            'car' => $car,
            'expenses' => fn (): Collection => $car->carExpenses->sortByDesc('invoice_date')->values(),
            'refuels' => fn (): Collection => $car->refuels,
            'start_milage' => $car->start_milage,
        ];
    }
}
