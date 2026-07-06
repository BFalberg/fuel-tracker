<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('owner can see their car on the dashboard', function () {
    $owner = User::factory()->create();
    Car::factory()->ownedBy($owner)->create(['name' => 'Owners Car']);

    $this->actingAs($owner)->get('/dashboard')->assertOk();
});

test('co-driver sees shared car on dashboard', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create(['name' => 'Shared Car']);
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)->get('/dashboard')->assertOk();
});

test('user cannot see a car they have no access to', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    Car::factory()->ownedBy($owner)->create();

    $this->actingAs($stranger)
        ->get('/cars')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
                ->has('cars', 0)
            )
        );
});

test('co-driver sees shared car in car list', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get('/cars')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
                ->has('cars', 1)
            )
        );
});

test('co-driver cannot edit a car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('cars.edit', $car))
        ->assertForbidden();
});

test('stranger cannot view a car', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($stranger)
        ->get(route('cars.show', $car))
        ->assertForbidden();
});

test('co-driver can view a car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('cars.show', $car))
        ->assertOk();
});
