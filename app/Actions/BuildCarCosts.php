<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use Illuminate\Database\Eloquent\Collection;

/**
 * @phpstan-type CarCosts array{
 *     energy: float,
 *     otherExpenses: float,
 *     ownership: float,
 *     total: float,
 *     kilometers: int,
 *     perKilometer: array{energy: float, otherExpenses: float, total: float},
 * }
 */
final readonly class BuildCarCosts
{
    /**
     * Energy is what the car's driving costs: every refuel or charge, plus the
     * expenses that buy energy, such as an EV's charging subscription.
     * Ownership is the purchase price less what the car sold for.
     *
     * @return CarCosts
     */
    public function handle(Car $car): array
    {
        $refuels = $car->refuels()->get(['mileage', 'total_price']);
        $expenses = $car->carExpenses()->get(['expense_type', 'amount']);

        $energyExpenseTypes = $car->energyExpenseTypes();
        $buysEnergy = fn (CarExpense $expense): bool => in_array($expense->expense_type, $energyExpenseTypes, true);

        $energy = $refuels->reduce(fn (float $total, Refuel $refuel): float => $total + (float) $refuel->total_price, 0.0)
            + $this->sumAmount($expenses->filter($buysEnergy));
        $other = $this->sumAmount($expenses->reject($buysEnergy));
        $ownership = (float) $car->purchase_price - (float) $car->sale_price;
        $total = $energy + $other + $ownership;

        $mileages = $refuels->map(fn (Refuel $refuel): int => $refuel->mileage)->all();
        $kilometers = $mileages === [] ? 0 : max($mileages) - ($car->start_milage ?? min($mileages));

        return [
            'energy' => round($energy, 2),
            'otherExpenses' => round($other, 2),
            'ownership' => round($ownership, 2),
            'total' => round($total, 2),
            'kilometers' => $kilometers,
            'perKilometer' => [
                'energy' => $this->perKilometer($energy, $kilometers),
                'otherExpenses' => $this->perKilometer($other, $kilometers),
                'total' => $this->perKilometer($total, $kilometers),
            ],
        ];
    }

    /**
     * @param  Collection<int, CarExpense>  $expenses
     */
    private function sumAmount(Collection $expenses): float
    {
        return $expenses->reduce(fn (float $total, CarExpense $expense): float => $total + (float) $expense->amount, 0.0);
    }

    private function perKilometer(float $amount, int $kilometers): float
    {
        return $kilometers > 0 ? round($amount / $kilometers, 2) : 0.0;
    }
}
