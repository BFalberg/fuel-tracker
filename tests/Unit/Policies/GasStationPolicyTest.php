<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use App\Policies\GasStationPolicy;

it('lets a user manage a station that only their own cars use', function (): void {
    $user = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);
    $station = GasStation::factory()->create();
    Refuel::factory()->forCar($car)->atStation($station)->create();

    $policy = new GasStationPolicy;

    foreach ([$user, $coDriver] as $member) {
        expect($policy->update($member, $station))->toBeTrue()
            ->and($policy->delete($member, $station))->toBeTrue();
    }
});

it('lets anyone manage a station nobody has used yet', function (): void {
    $station = GasStation::factory()->create();

    expect((new GasStationPolicy)->update(User::factory()->create(), $station))->toBeTrue();
});

it('forbids managing a station another user\'s car depends on', function (): void {
    $user = User::factory()->create();
    $station = GasStation::factory()->create();
    Refuel::factory()->forCar(Car::factory()->ownedBy($user)->create())->atStation($station)->create();
    Refuel::factory()->forCar(Car::factory()->ownedBy(User::factory()->create())->create())->atStation($station)->create();

    $policy = new GasStationPolicy;

    expect($policy->update($user, $station))->toBeFalse()
        ->and($policy->delete($user, $station))->toBeFalse();
});
