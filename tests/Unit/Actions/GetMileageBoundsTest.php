<?php

declare(strict_types=1);

use App\Actions\GetMileageBounds;
use App\Models\Car;
use App\Models\Refuel;

it('returns the neighbouring mileages of the refuel', function (): void {
    $car = Car::factory()->create();
    Refuel::factory()->forCar($car)->create(['mileage' => 1000]);
    $middle = Refuel::factory()->forCar($car)->create(['mileage' => 2000]);
    Refuel::factory()->forCar($car)->create(['mileage' => 3000]);
    Refuel::factory()->create(['mileage' => 1500]);

    expect(resolve(GetMileageBounds::class)->handle($middle))->toBe(['min' => 1000, 'max' => 3000]);
});

it('returns no bounds for a single refuel', function (): void {
    $refuel = Refuel::factory()->create(['mileage' => 1000]);

    expect(resolve(GetMileageBounds::class)->handle($refuel))->toBe(['min' => null, 'max' => null]);
});
