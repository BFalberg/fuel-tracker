<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardStats;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * The widest chart period we will render. Without a bound, a crafted
     * `?from=` drives an unbounded month-by-month loop.
     */
    private const MAX_CHART_MONTHS = 60;

    public function index(Request $request, BuildDashboardStats $buildDashboardStats): Response
    {
        $validated = $request->validate([
            'car' => 'nullable|integer',
            'from' => 'nullable|date_format:Y-m',
            'to' => 'nullable|date_format:Y-m',
        ]);

        $user = auth()->user();
        $cars = $user->cars()->orderBy('cars.created_at', 'desc')->get();

        /** The leading `!` resets the day to the 1st; without it Carbon fills in today's day-of-month and can roll into the next month. */
        $chartStart = isset($validated['from'])
            ? Carbon::createFromFormat('!Y-m', $validated['from'])->startOfMonth()
            : Carbon::now()->subMonths(5)->startOfMonth();

        $chartEnd = isset($validated['to'])
            ? Carbon::createFromFormat('!Y-m', $validated['to'])->endOfMonth()
            : Carbon::now()->endOfMonth();

        if ($chartStart->gt($chartEnd)) {
            $chartEnd = $chartStart->copy()->endOfMonth();
        }

        /** startOfMonth before subMonths: subtracting from a 31st rolls into the next month for shorter months. */
        $earliestAllowedStart = $chartEnd->copy()->startOfMonth()->subMonths(self::MAX_CHART_MONTHS - 1);

        if ($chartStart->lt($earliestAllowedStart)) {
            $chartStart = $earliestAllowedStart;
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

        $selectedCar = $cars->firstWhere('id', (int) ($validated['car'] ?? 0)) ?? $cars->first();

        return Inertia::render('dashboard', [
            'cars' => $cars->map(fn ($car) => ['id' => $car->id, 'name' => $car->name])->values(),
            'selectedCarId' => $selectedCar->id,
            'selectedFrom' => $chartStart->format('Y-m'),
            'selectedTo' => $chartEnd->format('Y-m'),
            'stats' => Inertia::defer($buildDashboardStats->handle($selectedCar, $chartStart, $chartEnd)),
        ]);
    }
}
