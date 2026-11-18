<?php

declare(strict_types=1);

use App\Actions\GetRefuelFormData;
use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;

it('orders the gas stations by their latest refuel', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $older = GasStation::factory()->create();
    $newer = GasStation::factory()->create();
    Refuel::factory()->forCar($car)->atStation($older)->create(['refueled_at' => now()->subDay(), 'created_at' => now()]);
    Refuel::factory()->forCar($car)->atStation($newer)->create(['refueled_at' => now(), 'created_at' => now()->subDay()]);

    $data = resolve(GetRefuelFormData::class)->handle($user, true);

    expect($data['cars']->pluck('id')->all())->toBe([$car->id])
        ->and($data['gasStations']->pluck('id')->all())->toBe([$newer->id, $older->id]);
});

it('returns every gas station when not ordered by latest refuel', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();
    GasStation::factory()->count(2)->create();

    $data = resolve(GetRefuelFormData::class)->handle($user, false);

    expect($data['cars'])->toHaveCount(1)
        ->and($data['gasStations'])->toHaveCount(2);
});

it('offers only active cars when creating, most recently refuelled first, with their last mileage', function (): void {
    $user = User::factory()->create();
    $idleCar = Car::factory()->ownedBy($user)->create();
    $dailyCar = Car::factory()->ownedBy($user)->create();
    $archivedCar = Car::factory()->ownedBy($user)->archived()->create();
    Refuel::factory()->forCar($idleCar)->create(['mileage' => 500, 'refueled_at' => now()->subMonth()]);
    Refuel::factory()->forCar($dailyCar)->create(['mileage' => 1000, 'refueled_at' => now()->subDay()]);
    Refuel::factory()->forCar($dailyCar)->create(['mileage' => 1200, 'refueled_at' => now()]);
    Refuel::factory()->forCar($archivedCar)->create(['refueled_at' => now()->addMinute()]);

    $cars = resolve(GetRefuelFormData::class)->handle($user, true)['cars'];

    expect($cars->pluck('id')->all())->toBe([$dailyCar->id, $idleCar->id])
        ->and($cars[0]->getAttribute('last_mileage'))->toBe(1200);
});
