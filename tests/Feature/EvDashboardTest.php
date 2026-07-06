<?php

use App\Actions\Dashboard\BuildDashboardStats;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

test('ev dashboard uses subscription expenses for monthly cost', function () {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create(['start_milage' => 0]);

    Carbon::setTestNow('2026-07-06');

    CarExpense::create([
        'car_id' => $car->id,
        'expense_type' => 'Abonnement',
        'amount' => 299,
        'invoice_date' => '2026-07-01',
    ]);

    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 50,
        'total_price' => 0,
        'mileage' => 1000,
    ]);
    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 50,
        'total_price' => 0,
        'mileage' => 1500,
    ]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['currentMonth']['amount'])->toBe(299.0)
        ->and($stats->first()['stats']['totals']['amount'])->toBe(299.0)
        ->and($stats->first()['stats']['currentMonth']['kilometers'])->toBe(500);

    Carbon::setTestNow();
});

test('gas car dashboard is unaffected by ev logic', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['start_milage' => 0, 'is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 40,
        'total_price' => 600,
        'mileage' => 1000,
    ]);
    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 40,
        'total_price' => 550,
        'mileage' => 1400,
    ]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['currentMonth']['amount'])->toBe(1150.0);

    Carbon::setTestNow();
});

test('ev price per kilometer uses subscription cost divided by total distance', function () {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create(['start_milage' => 0]);

    Carbon::setTestNow('2026-07-06');

    CarExpense::create([
        'car_id' => $car->id,
        'expense_type' => 'Abonnement',
        'amount' => 1000,
        'invoice_date' => '2026-07-01',
    ]);

    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 0]);
    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 2000]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['totals']['pricePerKilometer'])->toBe(0.5);

    Carbon::setTestNow();
});

test('gas car efficiency stats are calculated correctly', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    // mileage 100→200 = 100 km driven; 40 liters total → 40/100*100 = 40.0 L/100km
    Refuel::create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['isElectric'])->toBeFalse()
        ->and($stats->first()['stats']['efficiency']['currentMonth'])->toBe(40.0)
        ->and($stats->first()['stats']['efficiency']['allTime'])->toBe(40.0);

    Carbon::setTestNow();
});

test('ev car efficiency stats are calculated correctly', function () {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create();

    Carbon::setTestNow('2026-07-06');

    // mileage 0→500 = 500 km; 100 kWh total → 100/500*100 = 20.0 kWh/100km
    Refuel::create(['car_id' => $car->id, 'mileage' => 0, 'liters_refueled' => 50, 'total_price' => 0]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 500, 'liters_refueled' => 50, 'total_price' => 0]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['isElectric'])->toBeTrue()
        ->and($stats->first()['stats']['efficiency']['currentMonth'])->toBe(20.0)
        ->and($stats->first()['stats']['efficiency']['allTime'])->toBe(20.0);

    Carbon::setTestNow();
});

test('efficiency stats are null when no refuels exist', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats->first()['stats']['efficiency']['allTime'])->toBeNull();
});

test('currentMonth efficiency is null when no refuels exist in current month', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    // Refuels in a prior month only
    Carbon::setTestNow('2026-06-15');
    Refuel::create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    Carbon::setTestNow('2026-07-06');
    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats->first()['stats']['efficiency']['allTime'])->toBe(40.0);

    Carbon::setTestNow();
});
