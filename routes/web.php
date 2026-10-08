<?php

declare(strict_types=1);

use App\Http\Controllers\CarController;
use App\Http\Controllers\CarExpenseController;
use App\Http\Controllers\CarUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GasStationController;
use App\Http\Controllers\RefuelController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserEmailResetNotificationController;
use App\Http\Controllers\UserPasswordConfirmationController;
use App\Http\Controllers\UserPasswordController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware('auth')->group(function (): void {
    // Dashboard...
    Route::get('dashboard', [DashboardController::class, 'show'])->name('dashboard');

    // Car...
    Route::get('cars', [CarController::class, 'index'])->name('cars.index');
    Route::get('cars/create', [CarController::class, 'create'])->name('cars.create');
    Route::post('cars', [CarController::class, 'store'])->name('cars.store');
    Route::get('cars/{car}', [CarController::class, 'show'])->can('view', 'car')->name('cars.show');
    Route::get('cars/{car}/edit', [CarController::class, 'edit'])->can('update', 'car')->name('cars.edit');
    Route::put('cars/{car}', [CarController::class, 'update'])->can('update', 'car')->name('cars.update');
    Route::delete('cars/{car}', [CarController::class, 'destroy'])->can('delete', 'car')->name('cars.destroy');

    // Car Expense...
    Route::scopeBindings()->group(function (): void {
        Route::get('cars/{car}/expenses/create', [CarExpenseController::class, 'create'])->can('view', 'car')->name('cars.expenses.create');
        Route::post('cars/{car}/expenses', [CarExpenseController::class, 'store'])->can('view', 'car')->name('cars.expenses.store');
        Route::get('cars/{car}/expenses/{carExpense}/edit', [CarExpenseController::class, 'edit'])->can('update', 'carExpense')->name('cars.expenses.edit');
        Route::put('cars/{car}/expenses/{carExpense}', [CarExpenseController::class, 'update'])->can('update', 'carExpense')->name('cars.expenses.update');
        Route::delete('cars/{car}/expenses/{carExpense}', [CarExpenseController::class, 'destroy'])->can('delete', 'carExpense')->name('cars.expenses.destroy');
    });

    // Car User...
    Route::post('cars/{car}/users', [CarUserController::class, 'store'])->can('manageUsers', 'car')->name('cars.users.store');
    Route::delete('cars/{car}/users/{user}', [CarUserController::class, 'destroy'])->can('manageUsers', 'car')->name('cars.users.destroy');

    // Refuel...
    Route::get('refuels', [RefuelController::class, 'index'])->name('refuels.index');
    Route::get('refuels/create', [RefuelController::class, 'create'])->name('refuels.create');
    Route::post('refuels', [RefuelController::class, 'store'])->name('refuels.store');
    Route::get('refuels/{refuel}/edit', [RefuelController::class, 'edit'])->can('update', 'refuel')->name('refuels.edit');
    Route::put('refuels/{refuel}', [RefuelController::class, 'update'])->can('update', 'refuel')->name('refuels.update');
    Route::delete('refuels/{refuel}', [RefuelController::class, 'destroy'])->can('delete', 'refuel')->name('refuels.destroy');

    // Gas Station...
    Route::get('gas-stations', [GasStationController::class, 'index'])->name('gas-stations.index');
    Route::get('gas-stations/create', [GasStationController::class, 'create'])->name('gas-stations.create');
    Route::post('gas-stations', [GasStationController::class, 'store'])->name('gas-stations.store');
    Route::get('gas-stations/{gasStation}/edit', [GasStationController::class, 'edit'])->name('gas-stations.edit');
    Route::put('gas-stations/{gasStation}', [GasStationController::class, 'update'])->name('gas-stations.update');
    Route::delete('gas-stations/{gasStation}', [GasStationController::class, 'destroy'])->name('gas-stations.destroy');

    // User Profile...
    Route::get('settings', fn (): RedirectResponse => to_route('user-profile.edit'));
    Route::get('settings/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::patch('settings/profile', [UserProfileController::class, 'update'])->name('user-profile.update');

    // User...
    Route::delete('user', [UserController::class, 'destroy'])->name('user.destroy');

    // User Password...
    Route::get('settings/password', [UserPasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [UserPasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    // Appearance...
    Route::get('settings/appearance', fn () => Inertia::render('appearance/update'))->name('appearance.edit');

    // User Password Confirmation...
    Route::get('confirm-password', [UserPasswordConfirmationController::class, 'create'])
        ->name('password.confirm');
    Route::post('confirm-password', [UserPasswordConfirmationController::class, 'store'])
        ->name('password.confirm.store');

    // Session...
    Route::post('logout', [SessionController::class, 'destroy'])
        ->name('logout');
});

Route::middleware('guest')->group(function (): void {
    // User...
    Route::get('register', [UserController::class, 'create'])
        ->name('register');
    Route::post('register', [UserController::class, 'store'])
        ->name('register.store');

    // User Password...
    Route::get('reset-password/{token}', [UserPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [UserPasswordController::class, 'store'])
        ->name('password.store');

    // User Email Reset Notification...
    Route::get('forgot-password', [UserEmailResetNotificationController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [UserEmailResetNotificationController::class, 'store'])
        ->name('password.email');

    // Session...
    Route::get('login', [SessionController::class, 'create'])
        ->name('login');
    Route::post('login', [SessionController::class, 'store'])
        ->name('login.store');
});
