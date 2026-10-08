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
    ]);

    $station = GasStation::query()->sole();

    expect($refuel->gas_station_id)->toBe($station->id)
        ->and($station->name)->toBe('Fast Charge One')
        ->and($station->address)->toBe('Unknown');
});
