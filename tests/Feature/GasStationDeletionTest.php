<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;

test('deleting a gas station never deletes the refuels that reference it', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $station = GasStation::factory()->create();

    $refuels = Refuel::factory()
        ->count(3)
        ->forCar($car)
        ->atStation($station)
        ->create();

    $this->actingAs($user)
        ->delete(route('gas-stations.destroy', $station))
        ->assertRedirect();

    expect(GasStation::query()->find($station->id))->toBeNull()
        ->and(Refuel::query()->whereIn('id', $refuels->pluck('id'))->count())->toBe(3);

    $refuels->each(function (Refuel $refuel): void {
        expect($refuel->fresh()->gas_station_id)->toBeNull();
    });
});

test('another users refuels also survive a gas station deletion', function (): void {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $station = GasStation::factory()->create();

    $otherCar = Car::factory()->ownedBy($otherUser)->create();
    $otherRefuel = Refuel::factory()->forCar($otherCar)->atStation($station)->create();

    $this->actingAs($owner)
        ->delete(route('gas-stations.destroy', $station))
        ->assertRedirect();

    expect($otherRefuel->fresh())->not->toBeNull()
        ->and($otherRefuel->fresh()->gas_station_id)->toBeNull();
});
