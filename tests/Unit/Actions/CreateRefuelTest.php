<?php

declare(strict_types=1);

use App\Actions\CreateRefuel;
use App\Enums\ChargeType;
use App\Models\Car;
use App\Models\GasStation;

it('may create a charge with its charge type', function (): void {
    $car = Car::factory()->electric()->create();
    $station = GasStation::factory()->create();

    $refuel = resolve(CreateRefuel::class)->handle($car, [
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => 1000,
        'refueled_at' => now(),
        'charge_type' => 'ac',
    ]);

    expect($refuel->car_id)->toBe($car->id)
        ->and($refuel->gas_station_id)->toBe($station->id)
        ->and($refuel->refresh()->charge_type)->toBe(ChargeType::Ac);
});

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
