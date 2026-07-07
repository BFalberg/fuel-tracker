<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardStats;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, BuildDashboardStats $buildDashboardStats): Response
    {
        $user = auth()->user();
        $cars = $user->accessibleCars()->orderBy('cars.created_at', 'desc')->get();

        if ($cars->isEmpty()) {
            return Inertia::render('dashboard', [
                'cars' => [],
                'selectedCarId' => null,
                'message' => 'Please add a car to start tracking fuel consumption.',
            ]);
        }

        $selectedCar = $cars->firstWhere('id', (int) $request->query('car')) ?? $cars->first();

        return Inertia::render('dashboard', [
            'cars' => $cars->map(fn ($car) => ['id' => $car->id, 'name' => $car->name])->values(),
            'selectedCarId' => $selectedCar->id,
            'stats' => Inertia::defer($buildDashboardStats->handle($selectedCar)),
        ]);
    }
}
