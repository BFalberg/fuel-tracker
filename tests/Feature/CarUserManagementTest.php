<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('owner can add a co-driver by email', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create(['email' => 'codriver@example.com']);
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->post(route('cars.users.store', $car), ['email' => 'codriver@example.com'])
        ->assertRedirect();

    expect($car->users()->where('users.id', $coDriver->id)->wherePivot('role', 'co_driver')->exists())->toBeTrue();
});

test('adding co-driver with unknown email returns validation error', function () {
    $owner = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->post(route('cars.users.store', $car), ['email' => 'nobody@example.com'])
        ->assertSessionHasErrors('email');
});

test('co-driver cannot add other users', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $stranger = User::factory()->create(['email' => 'stranger@example.com']);
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->post(route('cars.users.store', $car), ['email' => 'stranger@example.com'])
        ->assertForbidden();
});

test('owner can remove a co-driver', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($owner)
        ->delete(route('cars.users.destroy', [$car, $coDriver]))
        ->assertRedirect();

    expect($car->users()->where('users.id', $coDriver->id)->exists())->toBeFalse();
});

test('owner cannot remove themselves', function () {
    $owner = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->delete(route('cars.users.destroy', [$car, $owner]))
        ->assertSessionHasErrors('user');
});
