<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\CarExpenseController;
use App\Http\Controllers\CarUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GasStationController;
use App\Http\Controllers\RefuelController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('cars', CarController::class);
    Route::resource('refuels', RefuelController::class)->except(['show']);
    Route::resource('gas-stations', GasStationController::class)->except(['show']);

    // Car Expenses routes
    Route::prefix('cars/{car}')->group(function () {
        Route::get('expenses/create', [CarExpenseController::class, 'create'])->name('cars.expenses.create');
        Route::post('expenses', [CarExpenseController::class, 'store'])->name('cars.expenses.store');
        Route::get('expenses/{expense}/edit', [CarExpenseController::class, 'edit'])->name('cars.expenses.edit');
        Route::put('expenses/{expense}', [CarExpenseController::class, 'update'])->name('cars.expenses.update');
        Route::delete('expenses/{expense}', [CarExpenseController::class, 'destroy'])->name('cars.expenses.destroy');
    });

    // Car user management
    Route::post('cars/{car}/users', [CarUserController::class, 'store'])->name('cars.users.store');
    Route::delete('cars/{car}/users/{user}', [CarUserController::class, 'destroy'])->name('cars.users.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
