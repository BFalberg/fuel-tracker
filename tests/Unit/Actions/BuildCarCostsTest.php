<?php

declare(strict_types=1);

use App\Actions\BuildCarCosts;
use App\Enums\ExpenseType;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;

it('counts an EV charging subscription as energy, not as another expense', function (): void {
    $car = Car::factory()->electric()->create(['start_milage' => 1000, 'purchase_price' => 200000, 'sale_price' => null]);
    Refuel::factory()->forCar($car)->create(['mileage' => 1000, 'total_price' => 0]);
    Refuel::factory()->forCar($car)->create(['mileage' => 2000, 'total_price' => 100]);
    CarExpense::factory()->forCar($car)->create(['expense_type' => ExpenseType::Subscription, 'amount' => 1400]);
    CarExpense::factory()->forCar($car)->create(['expense_type' => ExpenseType::Insurance, 'amount' => 500]);

    expect(resolve(BuildCarCosts::class)->handle($car))->toBe([
        'energy' => 1500.0,
        'otherExpenses' => 500.0,
        'ownership' => 200000.0,
        'total' => 202000.0,
        'kilometers' => 1000,
        'perKilometer' => ['energy' => 1.5, 'otherExpenses' => 0.5, 'total' => 202.0],
    ]);
});

it('keeps a fossil car\'s subscription among the other expenses', function (): void {
    $car = Car::factory()->create(['start_milage' => null, 'purchase_price' => 50000, 'sale_price' => 10000]);
    Refuel::factory()->forCar($car)->create(['mileage' => 500, 'total_price' => 300]);
    Refuel::factory()->forCar($car)->create(['mileage' => 1500, 'total_price' => 700]);
    CarExpense::factory()->forCar($car)->create(['expense_type' => ExpenseType::Subscription, 'amount' => 200]);

    $costs = resolve(BuildCarCosts::class)->handle($car);

    expect($costs['energy'])->toBe(1000.0)
        ->and($costs['otherExpenses'])->toBe(200.0)
        ->and($costs['ownership'])->toBe(40000.0)
        ->and($costs['kilometers'])->toBe(1000);
});

it('reports zero distance for a car without refuels', function (): void {
    $car = Car::factory()->create(['purchase_price' => null]);

    $costs = resolve(BuildCarCosts::class)->handle($car);

    expect($costs['kilometers'])->toBe(0)
        ->and($costs['perKilometer']['total'])->toBe(0.0);
});
