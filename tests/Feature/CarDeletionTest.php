<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use App\Models\User;

test('a car with no history can be deleted', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->delete(route('cars.destroy', $car))
        ->assertRedirect();

    expect(Car::query()->find($car->id))->toBeNull();
});

test('a car with refuels cannot be deleted', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    Refuel::factory()->forCar($car)->create();

    $this->actingAs($user)
        ->delete(route('cars.destroy', $car))
        ->assertSessionHasErrors('car');

    expect(Car::query()->find($car->id))->not->toBeNull();
});

test('a car with expenses cannot be deleted', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    CarExpense::factory()->forCar($car)->create();

    $this->actingAs($user)
        ->delete(route('cars.destroy', $car))
        ->assertSessionHasErrors('car');

    expect(Car::query()->find($car->id))->not->toBeNull();
});

test('a co-driver still cannot delete a car', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->delete(route('cars.destroy', $car))
        ->assertForbidden();

    expect(Car::query()->find($car->id))->not->toBeNull();
});
