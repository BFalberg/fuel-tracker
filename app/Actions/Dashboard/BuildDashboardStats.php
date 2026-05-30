<?php

namespace App\Actions\Dashboard;

use App\Models\Refuel;
use Carbon\Carbon;
use Closure;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BuildDashboardStats
{
    public function handle(Collection $cars): Closure
    {
        return function () use ($cars): Collection {
            $now = Carbon::now();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();

            return $cars->map(function ($car) use ($startOfMonth, $endOfMonth): array {
                $mileageStats = Refuel::where('car_id', $car->id)
                    ->selectRaw('
                        MIN(mileage) as first_mileage,
                        MAX(mileage) as latest_mileage
                    ')
                    ->first();

                $totalDistance = $mileageStats->latest_mileage - $mileageStats->first_mileage;

                $monthlyMileageStats = Refuel::where('car_id', $car->id)
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->selectRaw('
                        MIN(mileage) as first_mileage,
                        MAX(mileage) as latest_mileage,
                        SUM(total_price) as total_amount
                    ')
                    ->first();

                $currentMonthDistance = $monthlyMileageStats->latest_mileage - $monthlyMileageStats->first_mileage;

                $averageStats = DB::table(function ($query) use ($car): void {
                    $query->from('refuels')
                        ->where('car_id', $car->id)
                        ->selectRaw('
                            YEAR(created_at) as year,
                            MONTH(created_at) as month,
                            SUM(total_price) as monthly_amount,
                            MAX(mileage) - MIN(mileage) as monthly_kilometers
                        ')
                        ->groupBy('year', 'month');
                }, 'monthly_stats')
                    ->selectRaw('
                        AVG(monthly_amount) as avg_monthly_amount,
                        AVG(monthly_kilometers) as avg_monthly_kilometers
                    ')
                    ->first();

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

                return [
                    'id' => $car->id,
                    'name' => $car->name,
                    'stats' => [
                        'currentMonth' => [
                            'amount' => $monthlyMileageStats->total_amount ?? 0,
                            'kilometers' => $currentMonthDistance ?? 0,
                        ],
                        'averages' => [
                            'monthlyAmount' => round($averageStats->avg_monthly_amount ?? 0, 2),
                            'monthlyKilometers' => round($averageStats->avg_monthly_kilometers ?? 0, 2),
                        ],
                        'totals' => [
                            'amount' => round($totalStats->total_amount_ever ?? 0, 2),
                            'kilometers' => round($totalDistance ?? 0, 2),
                            'pricePerKilometer' => round($totalStats->price_per_kilometer ?? 0, 2),
                        ],
                    ],
                ];
            });
        };
    }
}
