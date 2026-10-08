<?php

declare(strict_types=1);

use App\Actions\ShowCar;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use App\Models\User;

it('returns the car with lazy expenses and refuels', function (): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create(['start_milage' => 100]);
    $older = CarExpense::factory()->forCar($car)->create(['invoice_date' => '2026-01-01']);
    $newer = CarExpense::factory()->forCar($car)->create(['invoice_date' => '2026-03-01']);
    Refuel::factory()->forCar($car)->create();

    $data = resolve(ShowCar::class)->handle($car);

    expect($data['car']->relationLoaded('users'))->toBeTrue()
        ->and($data['start_milage'])->toBe(100)
        ->and($data['expenses']()->pluck('id')->all())->toBe([$newer->id, $older->id])
        ->and($data['refuels']())->toHaveCount(1);
});
