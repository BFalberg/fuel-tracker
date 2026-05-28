<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Refuel;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $cars = $user->cars()->orderBy('created_at', 'desc')->get();

        if ($cars->isEmpty()) {
            return Inertia::render('dashboard', [
                'stats' => null,
                'message' => 'Please add a car to start tracking fuel consumption.'
            ]);
        }

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $carStats = $cars->map(function ($car) use ($startOfMonth, $endOfMonth) {
            // Get the first and latest mileage readings
            $mileageStats = Refuel::where('car_id', $car->id)
                ->selectRaw('
                    MIN(mileage) as first_mileage,
                    MAX(mileage) as latest_mileage
                ')
                ->first();

            $totalDistance = $mileageStats->latest_mileage - $mileageStats->first_mileage;

            // This month's stats with actual distance calculation
            $monthlyMileageStats = Refuel::where('car_id', $car->id)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->selectRaw('
                    MIN(mileage) as first_mileage,
                    MAX(mileage) as latest_mileage,
                    SUM(total_price) as total_amount
                ')
                ->first();

            $currentMonthDistance = $monthlyMileageStats->latest_mileage - $monthlyMileageStats->first_mileage;

            // Average monthly stats
            $averageStats = DB::table(function ($query) use ($car) {
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

            // Total stats
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

        return Inertia::render('dashboard', [
            'cars' => $carStats,
        ]);
    }
}
