<?php

use App\Models\Car;
use App\Models\Refuel;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('the refuel list only shows refuels for cars the user can access', function () {
    $user = User::factory()->create();
    $stranger = User::factory()->create();

    $ownCar = Car::factory()->ownedBy($user)->create();
    $strangerCar = Car::factory()->ownedBy($stranger)->create();

    Refuel::factory()->forCar($ownCar)->create();
    Refuel::factory()->forCar($strangerCar)->create();

    $this->actingAs($user)
        ->get(route('refuels.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
                ->has('refuels.data', 1)
                ->where('refuels.data.0.car_id', $ownCar->id)
            )
        );
});

test('filtering by another users car returns nothing rather than their data', function () {
    $user = User::factory()->create();
    $stranger = User::factory()->create();

    Car::factory()->ownedBy($user)->create();
    $strangerCar = Car::factory()->ownedBy($stranger)->create();
    Refuel::factory()->forCar($strangerCar)->create();

    $this->actingAs($user)
        ->get(route('refuels.index', ['car_id' => $strangerCar->id]))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
                ->has('refuels.data', 0)
            )
        );
});

test('a stranger cannot open the edit form for someone elses refuel', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $refuel = Refuel::factory()->forCar($car)->create();

    $this->actingAs($stranger)
        ->get(route('refuels.edit', $refuel))
        ->assertForbidden();
});

test('a stranger cannot update someone elses refuel', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $refuel = Refuel::factory()->forCar($car)->create(['mileage' => 1000]);

    $this->actingAs($stranger)
        ->put(route('refuels.update', $refuel), [
            'car_id' => $car->id,
            'liters_refueled' => 40,
            'total_price' => 500,
            'mileage' => 5000,
        ])
        ->assertForbidden();

    expect($refuel->fresh()->mileage)->toBe(1000);
});

test('a stranger cannot delete someone elses refuel', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $refuel = Refuel::factory()->forCar($car)->create();

    $this->actingAs($stranger)
        ->delete(route('refuels.destroy', $refuel))
        ->assertForbidden();

    expect(Refuel::find($refuel->id))->not->toBeNull();
});

test('a co-driver can edit a refuel on a shared car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $refuel = Refuel::factory()->forCar($car)->create(['mileage' => 1000]);

    $this->actingAs($coDriver)
        ->get(route('refuels.edit', $refuel))
        ->assertOk();

    $this->actingAs($coDriver)
        ->put(route('refuels.update', $refuel), [
            'car_id' => $car->id,
            'liters_refueled' => 40,
            'total_price' => 500,
            'mileage' => 5000,
        ])
        ->assertRedirect(route('refuels.index'));

    expect($refuel->fresh()->mileage)->toBe(5000);
});

test('a co-driver can delete a refuel on a shared car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $refuel = Refuel::factory()->forCar($car)->create();

    $this->actingAs($coDriver)
        ->delete(route('refuels.destroy', $refuel))
        ->assertRedirect();

    expect(Refuel::find($refuel->id))->toBeNull();
});

test('a refuel cannot be moved to another car', function () {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();

    $refuel = Refuel::factory()->forCar($carA)->create(['mileage' => 1000]);

    $this->actingAs($user)
        ->put(route('refuels.update', $refuel), [
            'car_id' => $carB->id,
            'liters_refueled' => 40,
            'total_price' => 500,
            'mileage' => 5000,
        ]);

    expect($refuel->fresh()->car_id)->toBe($carA->id);
});
