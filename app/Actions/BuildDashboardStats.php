<?php

declare(strict_types=1);

namespace App\Actions;

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
 *         totals: array{amount: float, kilometers: float, pricePerKilometer: float|int, pricePerUnit: float|null},
 *         efficiency: Efficiency,
 *         monthlyTrends: list<MonthlyTrend>,
 *     },
 * }
 * @phpstan-type Segment array{month: string, distance: int, energy: float}
 * @phpstan-type Cost array{month: string|null, amount: float}
 */
final readonly class BuildDashboardStats
{
    /**
     * @return Closure(): DashboardStats
     */
    public function handle(Car $car, CarbonImmutable $chartStart, CarbonImmutable $chartEnd): Closure
    {
        return function () use ($car, $chartStart, $chartEnd): array {
            $refuels = Refuel::query()->where('car_id', $car->id)
                ->orderBy('mileage')
                ->get(['mileage', 'liters_refueled', 'total_price', 'refueled_at']);

            $segments = $this->segments($refuels);
            $costs = $this->costs($car, $refuels);

            $segmentsByMonth = $segments->groupBy('month');
            $costsByMonth = $costs->whereNotNull('month')->groupBy('month');

            $currentMonth = CarbonImmutable::now()->format('Y-m');
            $currentMonthSegments = $segmentsByMonth->get($currentMonth) ?? collect();

            $totalAmount = $this->sumAmount($costs);
            $totalDistance = $this->sumDistance($segments);
            $totalEnergy = $refuels->reduce(fn (float $total, Refuel $refuel): float => $total + (float) $refuel->liters_refueled, 0.0);

            return [
                'id' => $car->id,
                'name' => $car->name,
                'isElectric' => $car->is_electric,
                'stats' => [
                    'currentMonth' => [
                        'amount' => round($this->sumAmount($costsByMonth->get($currentMonth) ?? collect()), 2),
                        'kilometers' => $this->sumDistance($currentMonthSegments),
                        'litersThisMonth' => round($this->sumEnergy($currentMonthSegments), 2),
                    ],
                    'averages' => [
                        'monthlyAmount' => round($costsByMonth->map($this->sumAmount(...))->avg() ?? 0, 2),
                        'monthlyKilometers' => round($segmentsByMonth->map($this->sumDistance(...))->avg() ?? 0, 2),
                        'monthlyLiters' => round($segmentsByMonth->map($this->sumEnergy(...))->avg() ?? 0, 2),
                    ],
                    'totals' => [
                        'amount' => round($totalAmount, 2),
                        'kilometers' => round($totalDistance, 2),
                        'pricePerKilometer' => $totalDistance > 0 ? round($totalAmount / $totalDistance, 2) : 0,
                        'pricePerUnit' => $totalEnergy > 0 ? round($totalAmount / $totalEnergy, 2) : null,
                    ],
                    'efficiency' => [
                        'currentMonth' => $this->efficiency($currentMonthSegments),
                        'allTime' => $this->efficiency($segments),
                    ],
                    'monthlyTrends' => $this->monthlyTrends($segmentsByMonth, $costsByMonth, $chartStart, $chartEnd),
                ],
            ];
        };
    }

    /**
     * Each refuel after the first closes the segment driven since the previous
     * one: the kilometres driven and the energy refilled to cover them. The
     * first refuel only fills the tank, so it opens the series without a segment.
     *
     * @param  Collection<int, Refuel>  $refuels  ordered by mileage
     * @return Collection<int, Segment>
     */
    private function segments(Collection $refuels): Collection
    {
        $segments = collect();
        $previous = null;

        foreach ($refuels as $refuel) {
            if ($previous instanceof Refuel) {
                $segments->push([
                    'month' => $refuel->refueled_at->format('Y-m'),
                    'distance' => $refuel->mileage - $previous->mileage,
                    'energy' => (float) $refuel->liters_refueled,
                ]);
            }

            $previous = $refuel;
        }

        return $segments;
    }

    /**
     * Every refuel's price is money spent, including the first, plus the
     * expenses that buy energy, such as an EV's charging subscription.
     *
     * @param  Collection<int, Refuel>  $refuels
     * @return Collection<int, Cost>
     */
    private function costs(Car $car, Collection $refuels): Collection
    {
        $costs = $refuels->map(fn (Refuel $refuel): array => [
            'month' => $refuel->refueled_at->format('Y-m'),
            'amount' => (float) $refuel->total_price,
        ])->toBase();

        $energyExpenseTypes = $car->energyExpenseTypes();

        if ($energyExpenseTypes === []) {
            return $costs;
        }

        $energyExpenses = CarExpense::query()->where('car_id', $car->id)
            ->whereIn('expense_type', $energyExpenseTypes)
            ->get(['amount', 'invoice_date'])
            ->map(fn (CarExpense $expense): array => [
                'month' => $expense->invoice_date?->format('Y-m'),
                'amount' => (float) $expense->amount,
            ]);

        return $costs->concat($energyExpenses)->values();
    }

    /**
     * @param  Collection<string, Collection<int, Segment>>  $segmentsByMonth
     * @param  Collection<string, Collection<int, Cost>>  $costsByMonth
     * @return list<MonthlyTrend>
     */
    private function monthlyTrends(Collection $segmentsByMonth, Collection $costsByMonth, CarbonImmutable $periodStart, CarbonImmutable $periodEnd): array
    {
        $trends = [];
        $current = $periodStart->startOfMonth();
        $rangeEnd = $periodEnd->endOfMonth();

        while ($current->lte($rangeEnd)) {
            $month = $current->format('Y-m');
            $segments = $segmentsByMonth->get($month) ?? collect();

            $trends[] = [
                'month' => $month,
                'cost' => round($this->sumAmount($costsByMonth->get($month) ?? collect()), 2),
                'efficiency' => $this->efficiency($segments),
                'distance' => $this->sumDistance($segments),
                'liters' => round($this->sumEnergy($segments), 2),
            ];

            $current = $current->addMonth();
        }

        return $trends;
    }

    /**
     * Energy per 100 km over the given segments, or null without both energy and distance.
     *
     * @param  Collection<int, Segment>  $segments
     */
    private function efficiency(Collection $segments): ?float
    {
        $energy = $this->sumEnergy($segments);
        $distance = $this->sumDistance($segments);

        return ($energy > 0 && $distance > 0) ? round($energy / $distance * 100, 1) : null;
    }

    /**
     * @param  Collection<int, Segment>  $segments
     */
    private function sumDistance(Collection $segments): int
    {
        return $segments->reduce(fn (int $total, array $segment): int => $total + $segment['distance'], 0);
    }

    /**
     * @param  Collection<int, Segment>  $segments
     */
    private function sumEnergy(Collection $segments): float
    {
        return $segments->reduce(fn (float $total, array $segment): float => $total + $segment['energy'], 0.0);
    }

    /**
     * @param  Collection<int, Cost>  $costs
     */
    private function sumAmount(Collection $costs): float
    {
        return $costs->reduce(fn (float $total, array $cost): float => $total + $cost['amount'], 0.0);
    }
}
