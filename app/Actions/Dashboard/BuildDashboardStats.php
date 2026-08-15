<?php

namespace App\Actions\Dashboard;

use App\Enums\ExpenseType;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use Carbon\Carbon;
use Closure;

class BuildDashboardStats
{
    public function handle(Car $car, Carbon $chartStart, Carbon $chartEnd): Closure
    {
        return function () use ($car, $chartStart, $chartEnd): array {
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = Carbon::now()->endOfMonth();

            $mileageStats = Refuel::where('car_id', $car->id)
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $totalDistance = ($mileageStats->latest_mileage ?? 0) - ($mileageStats->first_mileage ?? 0);

            $currentMonthMileageStats = Refuel::where('car_id', $car->id)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $currentMonthDistance = ($currentMonthMileageStats->latest_mileage ?? 0) - ($currentMonthMileageStats->first_mileage ?? 0);

            if ($car->is_electric) {
                return $this->buildEvStats($car, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance, $chartStart, $chartEnd);
            }

            return $this->buildGasStats($car, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance, $chartStart, $chartEnd);
        };
    }

    private function buildEvStats(Car $car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance, Carbon $chartStart, Carbon $chartEnd): array
    {
        $currentMonthAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', ExpenseType::Subscription->value)
            ->whereBetween('invoice_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->sum('amount');

        $totalAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', ExpenseType::Subscription->value)
            ->sum('amount');

        $avgMonthlyAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', ExpenseType::Subscription->value)
            ->whereNotNull('invoice_date')
            ->get(['amount', 'invoice_date'])
            ->groupBy(fn ($e) => Carbon::parse($e->invoice_date)->format('Y-m'))
            ->map(fn ($group) => $group->sum('amount'))
            ->avg() ?? 0;

        $evMonthlyRefuels = Refuel::where('car_id', $car->id)
            ->get(['mileage', 'liters_refueled', 'created_at'])
            ->groupBy(fn ($r) => $r->created_at->format('Y-m'));

        $avgMonthlyKm = $evMonthlyRefuels
            ->map(fn ($group) => $group->max('mileage') - $group->min('mileage'))
            ->avg() ?? 0;

        $avgMonthlyLiters = $evMonthlyRefuels
            ->map(fn ($group) => $group->sum('liters_refueled'))
            ->avg() ?? 0;

        $pricePerKilometer = $totalDistance > 0 ? round((float) $totalAmount / $totalDistance, 2) : 0;

        $efficiency = $this->calculateEfficiency($car->id, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance);

        $litersThisMonth = (float) Refuel::where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('liters_refueled');

        return [
            'id' => $car->id,
            'name' => $car->name,
            'isElectric' => $car->is_electric,
            'stats' => [
                'currentMonth' => [
                    'amount' => (float) $currentMonthAmount,
                    'kilometers' => $currentMonthDistance,
                    'litersThisMonth' => $litersThisMonth,
                ],
                'averages' => [
                    'monthlyAmount' => round($avgMonthlyAmount, 2),
                    'monthlyKilometers' => round($avgMonthlyKm, 2),
                    'monthlyLiters' => round($avgMonthlyLiters, 2),
                ],
                'totals' => [
                    'amount' => round((float) $totalAmount, 2),
                    'kilometers' => round($totalDistance, 2),
                    'pricePerKilometer' => $pricePerKilometer,
                ],
                'efficiency' => $efficiency,
                'monthlyTrends' => $this->buildMonthlyTrends($car, $chartStart, $chartEnd),
            ],
        ];
    }

    private function buildGasStats(Car $car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance, Carbon $chartStart, Carbon $chartEnd): array
    {
        $monthlyAmountStats = Refuel::where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw('SUM(total_price) as total_amount')
            ->first();

        $monthlyRefuels = Refuel::where('car_id', $car->id)
            ->get(['total_price', 'mileage', 'liters_refueled', 'created_at'])
            ->groupBy(fn ($r) => $r->created_at->format('Y-m'));

        $avgMonthlyAmount = $monthlyRefuels
            ->map(fn ($group) => $group->sum('total_price'))
            ->avg() ?? 0;

        $avgMonthlyKm = $monthlyRefuels
            ->map(fn ($group) => $group->max('mileage') - $group->min('mileage'))
            ->avg() ?? 0;

        $avgMonthlyLiters = $monthlyRefuels
            ->map(fn ($group) => $group->sum('liters_refueled'))
            ->avg() ?? 0;

        $totalStats = Refuel::where('car_id', $car->id)
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

        $litersThisMonth = (float) Refuel::where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('liters_refueled');

        return [
            'id' => $car->id,
            'name' => $car->name,
            'isElectric' => $car->is_electric,
            'stats' => [
                'currentMonth' => [
                    'amount' => (float) ($monthlyAmountStats->total_amount ?? 0),
                    'kilometers' => $currentMonthDistance,
                    'litersThisMonth' => $litersThisMonth,
                ],
                'averages' => [
                    'monthlyAmount' => round($avgMonthlyAmount, 2),
                    'monthlyKilometers' => round($avgMonthlyKm, 2),
                    'monthlyLiters' => round($avgMonthlyLiters, 2),
                ],
                'totals' => [
                    'amount' => round($totalStats->total_amount_ever ?? 0, 2),
                    'kilometers' => round($totalDistance, 2),
                    'pricePerKilometer' => round($totalStats->price_per_kilometer ?? 0, 2),
                ],
                'efficiency' => $efficiency,
                'monthlyTrends' => $this->buildMonthlyTrends($car, $chartStart, $chartEnd),
            ],
        ];
    }

    private function calculateEfficiency(int $carId, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance): array
    {
        $currentMonthLiters = Refuel::where('car_id', $carId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('liters_refueled');

        $totalLiters = Refuel::where('car_id', $carId)->sum('liters_refueled');

        return [
            'currentMonth' => ($currentMonthLiters > 0 && $currentMonthDistance > 0)
                ? round((float) $currentMonthLiters / $currentMonthDistance * 100, 1)
                : null,
            'allTime' => ($totalLiters > 0 && $totalDistance > 0)
                ? round((float) $totalLiters / $totalDistance * 100, 1)
                : null,
        ];
    }

    /**
     * Loads the whole period in two queries and buckets it in PHP, rather than
     * issuing two queries per month in the range.
     */
    private function buildMonthlyTrends(Car $car, Carbon $periodStart, Carbon $periodEnd): array
    {
        $rangeStart = $periodStart->copy()->startOfMonth();
        $rangeEnd = $periodEnd->copy()->endOfMonth();

        $refuelsByMonth = Refuel::where('car_id', $car->id)
            ->whereBetween('created_at', [$rangeStart, $rangeEnd])
            ->get(['mileage', 'liters_refueled', 'total_price', 'created_at'])
            ->groupBy(fn ($refuel) => $refuel->created_at->format('Y-m'));

        $subscriptionsByMonth = $car->is_electric
            ? CarExpense::where('car_id', $car->id)
                ->where('expense_type', ExpenseType::Subscription->value)
                ->whereNotNull('invoice_date')
                ->whereBetween('invoice_date', [$rangeStart->toDateString(), $rangeEnd->toDateString()])
                ->get(['amount', 'invoice_date'])
                ->groupBy(fn ($expense) => Carbon::parse($expense->invoice_date)->format('Y-m'))
            : collect();

        $trends = [];
        $current = $rangeStart->copy();

        while ($current->lte($rangeEnd)) {
            $month = $current->format('Y-m');
            $refuels = $refuelsByMonth->get($month) ?? collect();

            $cost = $car->is_electric
                ? (float) ($subscriptionsByMonth->get($month)?->sum('amount') ?? 0)
                : (float) $refuels->sum('total_price');

            $distance = $refuels->isEmpty() ? 0 : (int) ($refuels->max('mileage') - $refuels->min('mileage'));
            $liters = (float) $refuels->sum('liters_refueled');

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

            $current->addMonth();
        }

        return $trends;
    }
}
