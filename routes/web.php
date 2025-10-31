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
    Route::post('cars', [CarController::class, 'store'])
        ->name('cars.store');
    Route::get('cars/{car}/edit', [CarController::class, 'edit'])
        ->name('cars.edit');
    Route::put('cars/{car}', [CarController::class, 'update'])
        ->name('cars.update');
    Route::delete('cars/{car}', [CarController::class, 'destroy'])
        ->name('cars.destroy');

    // Refuels routes
    Route::resource('refuels', RefuelController::class)
        ->only(['index']);
    Route::get('refuels/create', [RefuelController::class, 'create'])
        ->name('refuels.create');
    Route::post('refuels', [RefuelController::class, 'store'])
        ->name('refuels.store');
    Route::get('refuels/{refuel}/edit', [RefuelController::class, 'edit'])
        ->name('refuels.edit');
    Route::put('refuels/{refuel}', [RefuelController::class, 'update'])
        ->name('refuels.update');
    Route::delete('refuels/{refuel}', [RefuelController::class, 'destroy'])
        ->name('refuels.destroy');

    // Gas Stations routes
    Route::resource('gas-stations', GasStationController::class)
        ->only(['index']);
    Route::get('gas-stations/create', [GasStationController::class, 'create'])
        ->name('gas-stations.create');
    Route::post('gas-stations', [GasStationController::class, 'store'])
        ->name('gas-stations.store');
    Route::get('gas-stations/{gas_station}/edit', [GasStationController::class, 'edit'])
        ->name('gas-stations.edit');
    Route::put('gas-stations/{gas_station}', [GasStationController::class, 'update'])
        ->name('gas-stations.update');
    Route::delete('gas-stations/{gas_station}', [GasStationController::class, 'destroy'])
        ->name('gas-stations.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
