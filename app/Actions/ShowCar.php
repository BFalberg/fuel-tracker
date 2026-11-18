<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\CarExpense;
use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @phpstan-import-type CarCosts from BuildCarCosts
 */
final readonly class ShowCar
{
    public function __construct(private BuildCarCosts $buildCarCosts) {}

    /**
     * @return array{car: Car, expenses: Closure(): Collection<int, CarExpense>, costs: Closure(): CarCosts}
     */
    public function handle(Car $car): array
    {
        $car->load(['users' => fn (BelongsToMany $q): BelongsToMany => $q->wherePivot('role', 'owner')->select('users.id', 'users.name')]);

        return [
            'car' => $car,
            'expenses' => fn (): Collection => $car->carExpenses->sortByDesc('invoice_date')->values(),
            'costs' => fn (): array => $this->buildCarCosts->handle($car),
        ];
    }
}
