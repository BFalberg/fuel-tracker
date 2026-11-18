<?php

declare(strict_types=1);

use App\Actions\ListGasStations;
use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;

it('lists the newest gas stations first with their refuel count', function (): void {
    $user = User::factory()->create();
    $older = GasStation::factory()->create(['created_at' => now()->subDay()]);
    $newer = GasStation::factory()->create(['created_at' => now()]);
    Refuel::factory()->count(2)->forCar(Car::factory()->ownedBy($user)->create())->atStation($older)->create();

    $stations = resolve(ListGasStations::class)->handle($user);

    expect($stations->pluck('id')->all())->toBe([$newer->id, $older->id])
        ->and($stations[1]['refuels_count'])->toBe(2)
        ->and($stations->pluck('can_manage')->all())->toBe([true, true]);
});
