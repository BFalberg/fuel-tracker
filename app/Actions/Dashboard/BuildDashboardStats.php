<?php

namespace App\Actions\Dashboard;

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use Carbon\Carbon;
use Closure;

class BuildDashboardStats
{
    public function handle(Car $car, Carbon $periodStart, Carbon $periodEnd): Closure
    {
        return function () use ($car, $periodStart, $periodEnd): array {
            $mileageStats = Refuel::where('car_id', $car->id)
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $totalDistance = ($mileageStats->latest_mileage ?? 0) - ($mileageStats->first_mileage ?? 0);

            $periodMileageStats = Refuel::where('car_id', $car->id)
                ->whereBetween('created_at', [$periodStart, $periodEnd])
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $periodDistance = ($periodMileageStats->latest_mileage ?? 0) - ($periodMileageStats->first_mileage ?? 0);

            if ($car->is_electric) {
                return $this->buildEvStats($car, $periodStart, $periodEnd, $totalDistance, $periodDistance);
            }

            return $this->buildGasStats($car, $periodStart, $periodEnd, $totalDistance, $periodDistance);
        };
    }

    private function buildEvStats(Car $car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance): array
    {
        $currentMonthAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', 'Abonnement')
            ->whereBetween('invoice_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->sum('amount');

        $totalAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', 'Abonnement')
            ->sum('amount');

        $avgMonthlyAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', 'Abonnement')
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
                'monthlyTrends' => $this->buildMonthlyTrends($car),
            ],
        ];
    }

    private function buildGasStats(Car $car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance): array
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
                'monthlyTrends' => $this->buildMonthlyTrends($car),
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

    private function buildMonthlyTrends(Car $car): array
    {
        $trends = [];

        for ($i = 5; $i >= 0; $i--) {
            $start = Carbon::now()->subMonths($i)->startOfMonth();
            $end = $start->copy()->endOfMonth();

            if ($car->is_electric) {
                $cost = (float) CarExpense::where('car_id', $car->id)
                    ->where('expense_type', 'Abonnement')
                    ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
                    ->sum('amount');
            } else {
                $cost = (float) Refuel::where('car_id', $car->id)
                    ->whereBetween('created_at', [$start, $end])
                    ->sum('total_price');
            }

            $mileageStats = Refuel::where('car_id', $car->id)
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage, SUM(liters_refueled) as total_liters')
                ->first();

            $distance = ($mileageStats->latest_mileage ?? 0) - ($mileageStats->first_mileage ?? 0);
            $liters = (float) ($mileageStats->total_liters ?? 0);

            $efficiency = ($liters > 0 && $distance > 0)
                ? round($liters / $distance * 100, 1)
                : null;

            $trends[] = [
                'month' => $start->format('Y-m'),
                'cost' => round($cost, 2),
                'efficiency' => $efficiency,
                'distance' => $distance,
                'liters' => round($liters, 2),
            ];
        }

        return $trends;
    }
}
