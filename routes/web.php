<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CarController;
use App\Http\Controllers\RefuelController;
use App\Http\Controllers\GasStationController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Cars routes
    Route::resource('cars', CarController::class)
        ->only(['index']);
    Route::get('cars/create', [CarController::class, 'create'])
        ->name('cars.create');
    Route::get('cars/{car}/edit', [CarController::class, 'edit'])
        ->name('cars.edit');

    // Refuels routes
    Route::resource('refuels', RefuelController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    // Gas Stations routes
    Route::resource('gas-stations', GasStationController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
