<?php

declare(strict_types=1);

use App\Actions\Dashboard\BuildDashboardStats;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use App\Models\User;
use Carbon\CarbonImmutable;

test('ev dashboard uses subscription expenses for monthly cost', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create(['start_milage' => 0]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    CarExpense::query()->create([
        'car_id' => $car->id,
        'expense_type' => 'Abonnement',
        'amount' => 299,
        'invoice_date' => '2026-07-01',
    ]);

    Refuel::query()->create(['car_id' => $car->id, 'liters_refueled' => 50, 'total_price' => 0, 'mileage' => 1000]);
    Refuel::query()->create(['car_id' => $car->id, 'liters_refueled' => 50, 'total_price' => 0, 'mileage' => 1500]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['currentMonth']['amount'])->toBe(299.0)
        ->and($stats['stats']['totals']['amount'])->toBe(299.0)
        ->and($stats['stats']['currentMonth']['kilometers'])->toBe(500);
});

test('gas car dashboard is unaffected by ev logic', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['start_milage' => 0, 'is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    Refuel::query()->create(['car_id' => $car->id, 'liters_refueled' => 40, 'total_price' => 600, 'mileage' => 1000]);
    Refuel::query()->create(['car_id' => $car->id, 'liters_refueled' => 40, 'total_price' => 550, 'mileage' => 1400]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['currentMonth']['amount'])->toBe(1150.0);
});

test('ev price per kilometer uses subscription cost divided by total distance', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create(['start_milage' => 0]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    CarExpense::query()->create([
        'car_id' => $car->id,
        'expense_type' => 'Abonnement',
        'amount' => 1000,
        'invoice_date' => '2026-07-01',
    ]);

    Refuel::query()->create(['car_id' => $car->id, 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 0]);
    Refuel::query()->create(['car_id' => $car->id, 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 2000]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['totals']['pricePerKilometer'])->toBe(0.5);
});

test('gas car efficiency stats are calculated correctly', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    // mileage 100→200 = 100 km; 40 liters total → 40/100*100 = 40.0 L/100km
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['isElectric'])->toBeFalse()
        ->and($stats['stats']['efficiency']['currentMonth'])->toBe(40.0)
        ->and($stats['stats']['efficiency']['allTime'])->toBe(40.0);
});

test('ev car efficiency stats are calculated correctly', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create();

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    // mileage 0→500 = 500 km; 100 kWh total → 100/500*100 = 20.0 kWh/100km
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 0, 'liters_refueled' => 50, 'total_price' => 0]);
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 500, 'liters_refueled' => 50, 'total_price' => 0]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['isElectric'])->toBeTrue()
        ->and($stats['stats']['efficiency']['currentMonth'])->toBe(20.0)
        ->and($stats['stats']['efficiency']['allTime'])->toBe(20.0);
});

test('efficiency stats are null when no refuels exist', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats['stats']['efficiency']['allTime'])->toBeNull();
});

test('currentMonth efficiency is null when no refuels exist in current month', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-06-15'));
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));
    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats['stats']['efficiency']['allTime'])->toBe(40.0);
});

test('stats include total liters refueled for current month', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 35, 'total_price' => 300]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['currentMonth']['litersThisMonth'])->toBe(55.0);
});

test('monthly trends reflect the selected period', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-06-15'));
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 30, 'total_price' => 450]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));
    Refuel::query()->create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 40, 'total_price' => 600]);

    $periodStart = CarbonImmutable::parse('2026-02-01');
    $periodEnd = CarbonImmutable::parse('2026-07-31');

    $stats = resolve(BuildDashboardStats::class)->handle($car, $periodStart, $periodEnd)();

    $trends = $stats['stats']['monthlyTrends'];

    expect($trends)->toHaveCount(6);

    $june = collect($trends)->firstWhere('month', '2026-06');
    $july = collect($trends)->firstWhere('month', '2026-07');

    expect($june['cost'])->toBe(450.0)
        ->and($july['cost'])->toBe(600.0);
});

test('monthly trends efficiency is null when data is insufficient', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    $july = collect($stats['stats']['monthlyTrends'])->firstWhere('month', '2026-07');

    expect($july['efficiency'])->toBeNull();
});
