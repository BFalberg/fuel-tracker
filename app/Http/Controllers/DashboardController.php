<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardStats;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, BuildDashboardStats $buildDashboardStats): Response
    {
        $user = auth()->user();
        $cars = $user->accessibleCars()->orderBy('cars.created_at', 'desc')->get();

        $chartStart = $request->query('from')
            ? Carbon::createFromFormat('Y-m', $request->query('from'))->startOfMonth()
            : Carbon::now()->subMonths(5)->startOfMonth();

        $chartEnd = $request->query('to')
            ? Carbon::createFromFormat('Y-m', $request->query('to'))->endOfMonth()
            : Carbon::now()->endOfMonth();

        if ($chartStart->gt($chartEnd)) {
            $chartEnd = $chartStart->copy()->endOfMonth();
        }

        if ($cars->isEmpty()) {
            return Inertia::render('dashboard', [
                'cars' => [],
                'selectedCarId' => null,
                'selectedFrom' => $chartStart->format('Y-m'),
                'selectedTo' => $chartEnd->format('Y-m'),
                'message' => 'Please add a car to start tracking fuel consumption.',
            ]);
        }

        $selectedCar = $cars->firstWhere('id', (int) $request->query('car')) ?? $cars->first();

        return Inertia::render('dashboard', [
            'cars' => $cars->map(fn ($car) => ['id' => $car->id, 'name' => $car->name])->values(),
            'selectedCarId' => $selectedCar->id,
            'selectedFrom' => $chartStart->format('Y-m'),
            'selectedTo' => $chartEnd->format('Y-m'),
            'stats' => Inertia::defer($buildDashboardStats->handle($selectedCar, $chartStart, $chartEnd)),
        ]);
    }
}
