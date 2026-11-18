<?php

declare(strict_types=1);

use App\Actions\BuildDashboardStats;
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

    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'liters_refueled' => 50, 'total_price' => 0, 'mileage' => 1000]);
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'liters_refueled' => 50, 'total_price' => 0, 'mileage' => 1500]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['currentMonth']['amount'])->toBe(299.0)
        ->and($stats['stats']['totals']['amount'])->toBe(299.0)
        ->and($stats['stats']['currentMonth']['kilometers'])->toBe(500);
});

test('gas car dashboard is unaffected by ev logic', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['start_milage' => 0, 'is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'liters_refueled' => 40, 'total_price' => 600, 'mileage' => 1000]);
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'liters_refueled' => 40, 'total_price' => 550, 'mileage' => 1400]);

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

    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 0]);
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 2000]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['totals']['pricePerKilometer'])->toBe(0.5);
});

test('gas car efficiency stats are calculated correctly', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    // one 100 km segment refilled with 20 L; the first refuel's 20 L only fill the tank
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['isElectric'])->toBeFalse()
        ->and($stats['stats']['efficiency']['currentMonth'])->toBe(20.0)
        ->and($stats['stats']['efficiency']['allTime'])->toBe(20.0);
});

test('ev car efficiency stats are calculated correctly', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create();

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    // one 500 km segment recharged with 50 kWh
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 0, 'liters_refueled' => 50, 'total_price' => 0]);
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 500, 'liters_refueled' => 50, 'total_price' => 0]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['isElectric'])->toBeTrue()
        ->and($stats['stats']['efficiency']['currentMonth'])->toBe(10.0)
        ->and($stats['stats']['efficiency']['allTime'])->toBe(10.0);
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
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));
    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats['stats']['efficiency']['allTime'])->toBe(20.0);
});

test('liters this month sum the segments closed this month', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));

    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 200, 'liters_refueled' => 35, 'total_price' => 300]);

    $stats = resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::now()->startOfMonth(), CarbonImmutable::now()->endOfMonth())();

    expect($stats['stats']['currentMonth']['litersThisMonth'])->toBe(35.0);
});

test('monthly trends reflect the selected period', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->travelTo(CarbonImmutable::parse('2026-06-15'));
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 100, 'liters_refueled' => 30, 'total_price' => 450]);

    $this->travelTo(CarbonImmutable::parse('2026-07-06'));
    Refuel::query()->create(['car_id' => $car->id, 'refueled_at' => now(), 'mileage' => 200, 'liters_refueled' => 40, 'total_price' => 600]);

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

/**
 * @param  array<string, mixed>  $attributes
 */
function dashboardRefuel(Car $car, int $mileage, string $refueledAt, float $liters = 40, float $price = 0, array $attributes = []): Refuel
{
    return Refuel::factory()->forCar($car)->create([
        'mileage' => $mileage,
        'liters_refueled' => $liters,
        'total_price' => $price,
        'refueled_at' => $refueledAt,
        ...$attributes,
    ]);
}

/**
 * @return array<string, mixed>
 */
function julyStats(Car $car): array
{
    test()->travelTo(CarbonImmutable::parse('2026-07-28'));

    return resolve(BuildDashboardStats::class)->handle($car, CarbonImmutable::parse('2026-06-01'), CarbonImmutable::parse('2026-07-31'))();
}

/**
 * @param  array<string, mixed>  $stats
 * @return array<string, mixed>
 */
function trendFor(array $stats, string $month): array
{
    return collect($stats['stats']['monthlyTrends'])->firstWhere('month', $month);
}

test('a month with a single refuel gets the kilometres of its segment', function (): void {
    $car = Car::factory()->create(['is_electric' => false]);
    dashboardRefuel($car, 1000, '2026-06-15');
    dashboardRefuel($car, 1600, '2026-07-06');

    $stats = julyStats($car);

    expect($stats['stats']['currentMonth']['kilometers'])->toBe(600)
        ->and(trendFor($stats, '2026-07')['distance'])->toBe(600)
        ->and(trendFor($stats, '2026-06')['distance'])->toBe(0);
});

test('kilometres driven between months are not lost', function (): void {
    $car = Car::factory()->create(['is_electric' => false]);
    dashboardRefuel($car, 1000, '2026-06-01');
    dashboardRefuel($car, 1300, '2026-06-20');
    dashboardRefuel($car, 1500, '2026-07-05');
    dashboardRefuel($car, 1800, '2026-07-25');

    $stats = julyStats($car);

    expect(trendFor($stats, '2026-06')['distance'])->toBe(300)
        ->and(trendFor($stats, '2026-07')['distance'])->toBe(500)
        ->and($stats['stats']['totals']['kilometers'])->toBe(800.0)
        ->and($stats['stats']['averages']['monthlyKilometers'])->toBe(400.0);
});

test('the first refuel only fills the tank and adds no liters', function (): void {
    $car = Car::factory()->create(['is_electric' => false]);
    dashboardRefuel($car, 1000, '2026-07-01', liters: 50, price: 700);
    dashboardRefuel($car, 1500, '2026-07-20', liters: 30, price: 420);

    $stats = julyStats($car);

    expect($stats['stats']['currentMonth']['litersThisMonth'])->toBe(30.0)
        ->and($stats['stats']['averages']['monthlyLiters'])->toBe(30.0)
        ->and(trendFor($stats, '2026-07')['liters'])->toBe(30.0)
        ->and($stats['stats']['efficiency']['allTime'])->toBe(6.0)
        ->and($stats['stats']['currentMonth']['amount'])->toBe(1120.0)
        ->and($stats['stats']['totals']['amount'])->toBe(1120.0);
});

test('ev cost adds paid charges to the subscription', function (): void {
    $car = Car::factory()->electric()->create();
    CarExpense::query()->create([
        'car_id' => $car->id,
        'expense_type' => 'Abonnement',
        'amount' => 299,
        'invoice_date' => '2026-07-01',
    ]);
    dashboardRefuel($car, 1000, '2026-07-02', price: 50);
    dashboardRefuel($car, 1500, '2026-07-20', price: 75);

    $stats = julyStats($car);

    expect($stats['stats']['currentMonth']['amount'])->toBe(424.0)
        ->and($stats['stats']['averages']['monthlyAmount'])->toBe(424.0)
        ->and($stats['stats']['totals']['amount'])->toBe(424.0)
        ->and($stats['stats']['totals']['pricePerKilometer'])->toBe(0.85)
        ->and(trendFor($stats, '2026-07')['cost'])->toBe(424.0);
});

test('the refuel date, not the creation date, decides the month', function (): void {
    $car = Car::factory()->create(['is_electric' => false]);
    dashboardRefuel($car, 1000, '2026-05-30', price: 100, attributes: ['created_at' => '2026-07-10']);
    dashboardRefuel($car, 1400, '2026-06-10', price: 200, attributes: ['created_at' => '2026-07-10']);

    $stats = julyStats($car);

    expect(trendFor($stats, '2026-06')['distance'])->toBe(400)
        ->and(trendFor($stats, '2026-06')['cost'])->toBe(200.0)
        ->and(trendFor($stats, '2026-07')['distance'])->toBe(0)
        ->and($stats['stats']['currentMonth']['amount'])->toBe(0.0);
});
