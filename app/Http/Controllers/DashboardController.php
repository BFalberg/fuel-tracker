<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BuildDashboardStats;
use App\Http\Requests\ShowDashboardRequest;
use App\Models\Car;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Inertia\Inertia;
use Inertia\Response;

final readonly class DashboardController
{
    public function show(ShowDashboardRequest $request, #[CurrentUser] User $user, BuildDashboardStats $action): Response
    {
        [$chartStart, $chartEnd] = $request->chartPeriod();

        $cars = $user->cars()->latest('cars.created_at')->get();
        $selectedCar = $cars->firstWhere('id', $request->integer('car')) ?? $cars->first();

        if ($selectedCar === null) {
            return Inertia::render('dashboard', [
                'cars' => [],
                'selectedCarId' => null,
                'selectedFrom' => $chartStart->format('Y-m'),
                'selectedTo' => $chartEnd->format('Y-m'),
                'message' => 'Please add a car to start tracking fuel consumption.',
            ]);
        }

        return Inertia::render('dashboard', [
            'cars' => $cars->map(fn (Car $car): array => ['id' => $car->id, 'name' => $car->name])->values(),
            'selectedCarId' => $selectedCar->id,
            'selectedFrom' => $chartStart->format('Y-m'),
            'selectedTo' => $chartEnd->format('Y-m'),
            'stats' => Inertia::defer($action->handle($selectedCar, $chartStart, $chartEnd)),
        ]);
    }
}
