<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Enums\ExpenseType;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Support\Collection;

/**
 * @phpstan-type Efficiency array{currentMonth: float|null, allTime: float|null}
 * @phpstan-type MonthlyTrend array{month: string, cost: float, efficiency: float|null, distance: int, liters: float}
 * @phpstan-type DashboardStats array{
 *     id: int,
 *     name: string,
 *     isElectric: bool,
 *     stats: array{
 *         currentMonth: array{amount: float, kilometers: int, litersThisMonth: float},
 *         averages: array{monthlyAmount: float, monthlyKilometers: float, monthlyLiters: float},
 *         totals: array{amount: float, kilometers: float, pricePerKilometer: float|int},
 *         efficiency: Efficiency,
 *         monthlyTrends: list<MonthlyTrend>,
 *     },
 * }
 */
final class BuildDashboardStats
{
    /**
     * @return Closure(): DashboardStats
     */
    public function handle(Car $car, CarbonImmutable $chartStart, CarbonImmutable $chartEnd): Closure
    {
        return function () use ($car, $chartStart, $chartEnd): array {
            $startOfMonth = CarbonImmutable::now()->startOfMonth();
            $endOfMonth = CarbonImmutable::now()->endOfMonth();

            $mileageStats = Refuel::query()->where('car_id', $car->id)
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $totalDistance = $this->toInt($mileageStats?->getAttribute('latest_mileage')) - $this->toInt($mileageStats?->getAttribute('first_mileage'));

            $currentMonthMileageStats = Refuel::query()->where('car_id', $car->id)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $currentMonthDistance = $this->toInt($currentMonthMileageStats?->getAttribute('latest_mileage')) - $this->toInt($currentMonthMileageStats?->getAttribute('first_mileage'));

            if ($car->is_electric) {
                return $this->buildEvStats($car, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance, $chartStart, $chartEnd);
            }

            return $this->buildGasStats($car, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance, $chartStart, $chartEnd);
        };
    }

    /**
     * @return DashboardStats
     */
    private function buildEvStats(Car $car, CarbonImmutable $startOfMonth, CarbonImmutable $endOfMonth, float $totalDistance, int $currentMonthDistance, CarbonImmutable $chartStart, CarbonImmutable $chartEnd): array
    {
        $currentMonthAmount = $this->toFloat(CarExpense::query()->where('car_id', $car->id)
            ->where('expense_type', ExpenseType::Subscription->value)
            ->whereBetween('invoice_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->sum('amount'));

        $totalAmount = $this->toFloat(CarExpense::query()->where('car_id', $car->id)
            ->where('expense_type', ExpenseType::Subscription->value)
            ->sum('amount'));

        $avgMonthlyAmount = CarExpense::query()->where('car_id', $car->id)
            ->where('expense_type', ExpenseType::Subscription->value)
            ->whereNotNull('invoice_date')
            ->get(['amount', 'invoice_date'])
            ->groupBy(fn ($e): string => CarbonImmutable::parse($e->invoice_date)->format('Y-m'))
            ->map(fn (Collection $group): float => $this->toFloat($group->sum('amount')))
            ->avg() ?? 0;

        $evMonthlyRefuels = Refuel::query()->where('car_id', $car->id)
            ->get(['mileage', 'liters_refueled', 'created_at'])
            ->groupBy(fn ($r) => $r->created_at->format('Y-m'));

        $avgMonthlyKm = $evMonthlyRefuels
            ->map(fn (Collection $group): int => $this->toInt($group->max('mileage')) - $this->toInt($group->min('mileage')))
            ->avg() ?? 0;

        $avgMonthlyLiters = $evMonthlyRefuels
            ->map(fn (Collection $group): float => $this->toFloat($group->sum('liters_refueled')))
            ->avg() ?? 0;

        $pricePerKilometer = $totalDistance > 0 ? round($totalAmount / $totalDistance, 2) : 0;

        $efficiency = $this->calculateEfficiency($car->id, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance);

        $litersThisMonth = $this->toFloat(Refuel::query()->where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('liters_refueled'));

        return [
            'id' => $car->id,
            'name' => $car->name,
            'isElectric' => $car->is_electric,
            'stats' => [
                'currentMonth' => [
                    'amount' => $currentMonthAmount,
                    'kilometers' => $currentMonthDistance,
                    'litersThisMonth' => $litersThisMonth,
                ],
                'averages' => [
                    'monthlyAmount' => round($avgMonthlyAmount, 2),
                    'monthlyKilometers' => round($avgMonthlyKm, 2),
                    'monthlyLiters' => round($avgMonthlyLiters, 2),
                ],
                'totals' => [
                    'amount' => round($totalAmount, 2),
                    'kilometers' => round($totalDistance, 2),
                    'pricePerKilometer' => $pricePerKilometer,
                ],
                'efficiency' => $efficiency,
                'monthlyTrends' => $this->buildMonthlyTrends($car, $chartStart, $chartEnd),
            ],
        ];
    }

    /**
     * @return DashboardStats
     */
    private function buildGasStats(Car $car, CarbonImmutable $startOfMonth, CarbonImmutable $endOfMonth, float $totalDistance, int $currentMonthDistance, CarbonImmutable $chartStart, CarbonImmutable $chartEnd): array
    {
        $monthlyAmountStats = Refuel::query()->where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw('SUM(total_price) as total_amount')
            ->first();

        $monthlyRefuels = Refuel::query()->where('car_id', $car->id)
            ->get(['total_price', 'mileage', 'liters_refueled', 'created_at'])
            ->groupBy(fn ($r) => $r->created_at->format('Y-m'));

        $avgMonthlyAmount = $monthlyRefuels
            ->map(fn (Collection $group): float => $this->toFloat($group->sum('total_price')))
            ->avg() ?? 0;

        $avgMonthlyKm = $monthlyRefuels
            ->map(fn (Collection $group): int => $this->toInt($group->max('mileage')) - $this->toInt($group->min('mileage')))
            ->avg() ?? 0;

        $avgMonthlyLiters = $monthlyRefuels
            ->map(fn (Collection $group): float => $this->toFloat($group->sum('liters_refueled')))
            ->avg() ?? 0;

        $totalStats = Refuel::query()->where('car_id', $car->id)
            ->selectRaw('
                SUM(total_price) as total_amount_ever,
                CASE
                    WHEN MAX(mileage) - MIN(mileage) > 0
                    THEN SUM(total_price) / (MAX(mileage) - MIN(mileage))
                    ELSE 0
                END as price_per_kilometer
            ')
            ->first();

        $efficiency = $this->calculateEfficiency($car->id, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance);

        $litersThisMonth = $this->toFloat(Refuel::query()->where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('liters_refueled'));

        return [
            'id' => $car->id,
            'name' => $car->name,
            'isElectric' => $car->is_electric,
            'stats' => [
                'currentMonth' => [
                    'amount' => $this->toFloat($monthlyAmountStats?->getAttribute('total_amount')),
                    'kilometers' => $currentMonthDistance,
                    'litersThisMonth' => $litersThisMonth,
                ],
                'averages' => [
                    'monthlyAmount' => round($avgMonthlyAmount, 2),
                    'monthlyKilometers' => round($avgMonthlyKm, 2),
                    'monthlyLiters' => round($avgMonthlyLiters, 2),
                ],
                'totals' => [
                    'amount' => round($this->toFloat($totalStats?->getAttribute('total_amount_ever')), 2),
                    'kilometers' => round($totalDistance, 2),
                    'pricePerKilometer' => round($this->toFloat($totalStats?->getAttribute('price_per_kilometer')), 2),
                ],
                'efficiency' => $efficiency,
                'monthlyTrends' => $this->buildMonthlyTrends($car, $chartStart, $chartEnd),
            ],
        ];
    }

    /**
     * @return Efficiency
     */
    private function calculateEfficiency(int $carId, CarbonImmutable $startOfMonth, CarbonImmutable $endOfMonth, float $totalDistance, int $currentMonthDistance): array
    {
        $currentMonthLiters = $this->toFloat(Refuel::query()->where('car_id', $carId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('liters_refueled'));

        $totalLiters = $this->toFloat(Refuel::query()->where('car_id', $carId)->sum('liters_refueled'));

        return [
            'currentMonth' => ($currentMonthLiters > 0 && $currentMonthDistance > 0)
                ? round($currentMonthLiters / $currentMonthDistance * 100, 1)
                : null,
            'allTime' => ($totalLiters > 0 && $totalDistance > 0)
                ? round($totalLiters / $totalDistance * 100, 1)
                : null,
        ];
    }

    /**
     * Loads the whole period in two queries and buckets it in PHP, rather than
     * issuing two queries per month in the range.
     *
     * @return list<MonthlyTrend>
     */
    private function buildMonthlyTrends(Car $car, CarbonImmutable $periodStart, CarbonImmutable $periodEnd): array
    {
        $rangeStart = $periodStart->startOfMonth();
        $rangeEnd = $periodEnd->endOfMonth();

        $refuelsByMonth = Refuel::query()->where('car_id', $car->id)
            ->whereBetween('created_at', [$rangeStart, $rangeEnd])
            ->get(['mileage', 'liters_refueled', 'total_price', 'created_at'])
            ->groupBy(fn ($refuel) => $refuel->created_at->format('Y-m'));

        $subscriptionsByMonth = $car->is_electric
            ? CarExpense::query()->where('car_id', $car->id)
                ->where('expense_type', ExpenseType::Subscription->value)
                ->whereNotNull('invoice_date')
                ->whereBetween('invoice_date', [$rangeStart->toDateString(), $rangeEnd->toDateString()])
                ->get(['amount', 'invoice_date'])
                ->groupBy(fn ($expense): string => CarbonImmutable::parse($expense->invoice_date)->format('Y-m'))
            : collect();

        $trends = [];
        $current = $rangeStart;

        while ($current->lte($rangeEnd)) {
            $month = $current->format('Y-m');
            $refuels = $refuelsByMonth->get($month) ?? collect();

            $cost = $car->is_electric
                ? $this->toFloat($subscriptionsByMonth->get($month)?->sum('amount'))
                : $this->toFloat($refuels->sum('total_price'));

            $distance = $refuels->isEmpty() ? 0 : $this->toInt($refuels->max('mileage')) - $this->toInt($refuels->min('mileage'));
            $liters = $this->toFloat($refuels->sum('liters_refueled'));

            $efficiency = ($liters > 0 && $distance > 0)
                ? round($liters / $distance * 100, 1)
                : null;

            $trends[] = [
                'month' => $month,
                'cost' => round($cost, 2),
                'efficiency' => $efficiency,
                'distance' => $distance,
                'liters' => round($liters, 2),
            ];

            $current = $current->addMonth();
        }

        return $trends;
    }

    /**
     * SQL aggregates come back as int, float, numeric string or null depending on the driver.
     */
    private function toFloat(mixed $aggregate): float
    {
        return is_numeric($aggregate) ? (float) $aggregate : 0.0;
    }

    /**
     * SQL aggregates come back as int, numeric string or null depending on the driver.
     */
    private function toInt(mixed $aggregate): int
    {
        return is_numeric($aggregate) ? (int) $aggregate : 0;
    }
}
