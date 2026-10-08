<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardStats;
use App\Models\Car;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController
{
    /**
     * The widest chart period we will render. Without a bound, a crafted
     * `?from=` drives an unbounded month-by-month loop.
     */
    private const int MAX_CHART_MONTHS = 60;

    public function index(Request $request, #[CurrentUser] User $user, BuildDashboardStats $buildDashboardStats): Response
    {
        $request->validate([
            'car' => ['nullable', 'integer'],
            'from' => ['nullable', 'date_format:Y-m'],
            'to' => ['nullable', 'date_format:Y-m'],
        ]);

        $cars = $user->cars()->latest('cars.created_at')->get();

        /** The leading `!` resets the day to the 1st; without it Carbon fills in today's day-of-month and can roll into the next month. */
        $requestedFrom = $request->filled('from') ? CarbonImmutable::createFromFormat('!Y-m', $request->string('from')->value()) : null;
        $requestedTo = $request->filled('to') ? CarbonImmutable::createFromFormat('!Y-m', $request->string('to')->value()) : null;

        $chartStart = $requestedFrom?->startOfMonth() ?? CarbonImmutable::now()->subMonths(5)->startOfMonth();
        $chartEnd = $requestedTo?->endOfMonth() ?? CarbonImmutable::now()->endOfMonth();

        if ($chartStart->gt($chartEnd)) {
            $chartEnd = $chartStart->endOfMonth();
        }

        /** startOfMonth before subMonths: subtracting from a 31st rolls into the next month for shorter months. */
        $earliestAllowedStart = $chartEnd->startOfMonth()->subMonths(self::MAX_CHART_MONTHS - 1);

        if ($chartStart->lt($earliestAllowedStart)) {
            $chartStart = $earliestAllowedStart;
        }

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
            'stats' => Inertia::defer($buildDashboardStats->handle($selectedCar, $chartStart, $chartEnd)),
        ]);
    }
}
