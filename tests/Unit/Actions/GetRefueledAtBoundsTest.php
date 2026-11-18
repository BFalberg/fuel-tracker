<?php

declare(strict_types=1);

use App\Actions\GetRefueledAtBounds;
use App\Models\Car;
use App\Models\Refuel;

it('returns the dates of the neighbouring refuels by mileage', function (): void {
    $car = Car::factory()->create();
    Refuel::factory()->forCar($car)->create(['mileage' => 1000, 'refueled_at' => '2026-07-01 08:00:00']);
    $middle = Refuel::factory()->forCar($car)->create(['mileage' => 2000, 'refueled_at' => '2026-07-10 08:00:00']);
    Refuel::factory()->forCar($car)->create(['mileage' => 3000, 'refueled_at' => '2026-07-20 08:00:00']);
    Refuel::factory()->create(['mileage' => 1500, 'refueled_at' => '2026-07-05 08:00:00']);

    ['min' => $min, 'max' => $max] = resolve(GetRefueledAtBounds::class)->handle($middle);

    expect($min?->toDateTimeString())->toBe('2026-07-01 08:00:00')
        ->and($max?->toDateTimeString())->toBe('2026-07-20 08:00:00');
});

it('returns no bounds for a single refuel', function (): void {
    $refuel = Refuel::factory()->create();

    expect(resolve(GetRefueledAtBounds::class)->handle($refuel))->toBe(['min' => null, 'max' => null]);
});
