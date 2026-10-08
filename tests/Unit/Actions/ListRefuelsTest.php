<?php

declare(strict_types=1);

use App\Actions\ListRefuels;
use App\Models\Car;
use App\Models\Refuel;
use App\Models\User;

it('paginates the refuels of the cars the user can access', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    Refuel::factory()->count(12)->forCar($car)->create();
    Refuel::factory()->forCar(Car::factory()->ownedBy(User::factory()->create())->create())->create();

    $refuels = resolve(ListRefuels::class)->handle($user);

    expect($refuels->total())->toBe(12)
        ->and($refuels->items())->toHaveCount(10)
        ->and($refuels->items()[0]->relationLoaded('car'))->toBeTrue()
        ->and($refuels->items()[0]->relationLoaded('gasStation'))->toBeTrue();
});

it('filters the refuels by car', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $otherCar = Car::factory()->ownedBy($user)->create();
    $refuel = Refuel::factory()->forCar($car)->create();
    Refuel::factory()->forCar($otherCar)->create();

    $refuels = resolve(ListRefuels::class)->handle($user, $car->id);

    expect(collect($refuels->items())->pluck('id')->all())->toBe([$refuel->id]);
});
