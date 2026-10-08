<?php

declare(strict_types=1);

use App\Actions\GetRefuelIndexData;
use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;

it('orders the gas stations by their refuel count', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $quiet = GasStation::factory()->create();
    $busy = GasStation::factory()->create();
    Refuel::factory()->forCar($car)->atStation($quiet)->create();
    Refuel::factory()->count(2)->forCar($car)->atStation($busy)->create();
    Car::factory()->ownedBy(User::factory()->create())->create();

    $data = resolve(GetRefuelIndexData::class)->handle($user);

    expect($data['cars']->pluck('id')->all())->toBe([$car->id])
        ->and($data['gasStations']->pluck('id')->all())->toBe([$busy->id, $quiet->id]);
});
