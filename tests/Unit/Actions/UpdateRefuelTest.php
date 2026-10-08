<?php

declare(strict_types=1);

use App\Actions\UpdateRefuel;
use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;

it('may update a refuel and keeps its type in line with the car', function (): void {
    $car = Car::factory()->electric()->create();
    $refuel = Refuel::factory()->forCar($car)->create(['type' => 'fossil', 'mileage' => 1000]);

    $updated = resolve(UpdateRefuel::class)->handle($refuel, [
        'liters_refueled' => 20,
        'total_price' => 300,
        'mileage' => 1100,
    ]);

    expect($updated->refresh()->mileage)->toBe(1100)
        ->and($updated->type)->toBe('charge');
});

it('creates a new gas station when a name is given', function (): void {
    $refuel = Refuel::factory()->create();

    $updated = resolve(UpdateRefuel::class)->handle($refuel, [
        'new_gas_station_name' => 'New Station',
        'new_gas_station_address' => 'Main Street 1',
        'liters_refueled' => 20,
        'total_price' => 300,
        'mileage' => $refuel->mileage,
    ]);

    $station = GasStation::query()->where('name', 'New Station')->sole();

    expect($updated->refresh()->gas_station_id)->toBe($station->id)
        ->and($station->address)->toBe('Main Street 1');
});
