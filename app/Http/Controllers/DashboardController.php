<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardStats;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(BuildDashboardStats $buildDashboardStats): Response
    {
        $user = auth()->user();
        $cars = $user->cars()->orderBy('created_at', 'desc')->get();

        if ($cars->isEmpty()) {
            return Inertia::render('dashboard', [
                'stats' => null,
                'message' => 'Please add a car to start tracking fuel consumption.',
            ]);
        }

        return Inertia::render('dashboard', [
            'cars' => Inertia::defer($buildDashboardStats->handle($cars))->once(),
        ]);
    }
}
