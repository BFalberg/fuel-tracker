<?php

declare(strict_types=1);

use App\Actions\CreateRefuel;
use App\Models\Car;
use App\Models\GasStation;

it('may create a refuel with the type of the car', function (bool $isElectric, string $type): void {
    $car = Car::factory()->create(['is_electric' => $isElectric]);
    $station = GasStation::factory()->create();

    $refuel = resolve(CreateRefuel::class)->handle($car, [
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => 1000,
        'refueled_at' => now(),
    ]);

    expect($refuel->car_id)->toBe($car->id)
        ->and($refuel->gas_station_id)->toBe($station->id)
        ->and($refuel->type)->toBe($type);
})->with([
    'electric' => [true, 'charge'],
    'fossil' => [false, 'fossil'],
]);

it('creates a new gas station when a name is given', function (): void {
    $car = Car::factory()->create();

    $refuel = resolve(CreateRefuel::class)->handle($car, [
        'new_gas_station_name' => 'Fast Charge One',
        'new_gas_station_address' => null,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => 1000,
        'refueled_at' => now(),
    ]);

    $station = GasStation::query()->sole();

    expect($refuel->gas_station_id)->toBe($station->id)
        ->and($station->name)->toBe('Fast Charge One')
        ->and($station->address)->toBe('Unknown');
});

it('places a new station at the position the refuel was logged from', function (): void {
    $refuel = resolve(CreateRefuel::class)->handle(Car::factory()->electric()->create(), [
        'new_gas_station_name' => 'Clever Viby Torv',
        'liters_refueled' => 20,
        'total_price' => 0,
        'mileage' => 1000,
        'refueled_at' => now(),
        'latitude' => 56.1296,
        'longitude' => 10.1626,
    ]);

    expect($refuel->gasStation?->only('latitude', 'longitude'))
        ->toBe(['latitude' => '56.1296000', 'longitude' => '10.1626000']);
});

it('moves an existing station to where a charge was logged on the spot', function (): void {
    $car = Car::factory()->electric()->create();
    $unplaced = GasStation::factory()->create();
    $placed = GasStation::factory()->create(['latitude' => 55.0, 'longitude' => 9.0]);

    foreach ([[$unplaced, 1000], [$placed, 1100]] as [$station, $mileage]) {
        resolve(CreateRefuel::class)->handle($car, [
            'gas_station_id' => $station->id,
            'liters_refueled' => 20,
            'total_price' => 0,
            'mileage' => $mileage,
            'refueled_at' => now(),
            'latitude' => 56.1296,
            'longitude' => 10.1626,
        ]);
    }

    expect($unplaced->refresh()->only('latitude', 'longitude'))->toBe(['latitude' => '56.1296000', 'longitude' => '10.1626000'])
        ->and($placed->refresh()->only('latitude', 'longitude'))->toBe(['latitude' => '56.1296000', 'longitude' => '10.1626000']);
});

it('does not place a station from a refuel logged long after the fact', function (): void {
    $station = GasStation::factory()->create();

    resolve(CreateRefuel::class)->handle(Car::factory()->electric()->create(), [
        'gas_station_id' => $station->id,
        'liters_refueled' => 20,
        'total_price' => 0,
        'mileage' => 1000,
        'refueled_at' => now()->subHours(3)->toIso8601String(),
        'latitude' => 56.1296,
        'longitude' => 10.1626,
    ]);

    expect($station->refresh()->latitude)->toBeNull();
});
