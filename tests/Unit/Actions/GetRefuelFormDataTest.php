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
    Refuel::factory()->forCar($car)->atStation($older)->create(['created_at' => now()->subDay()]);
    Refuel::factory()->forCar($car)->atStation($newer)->create(['created_at' => now()]);

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
