<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/dashboard')->assertOk();
});

test('dashboard shows message when user has no cars', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/dashboard')->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('message', 'Please add a car to start tracking fuel consumption.')
    );
});

test('dashboard selects newest car by default', function () {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create(['created_at' => now()->subDays(10)]);
    $newCar = Car::factory()->ownedBy($user)->create(['created_at' => now()]);

    $this->actingAs($user);

    $this->get('/dashboard')->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $newCar->id)
    );
});

test('dashboard respects car query parameter', function () {
    $user = User::factory()->create();
    $car1 = Car::factory()->ownedBy($user)->create(['created_at' => now()->subDays(10)]);
    Car::factory()->ownedBy($user)->create(['created_at' => now()]);

    $this->actingAs($user);

    $this->get("/dashboard?car={$car1->id}")->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $car1->id)
    );
});

test('dashboard falls back to newest car for invalid car param', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user);

    $this->get('/dashboard?car=99999')->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $car->id)
    );
});

test('dashboard does not expose other users cars via query param', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $myCar = Car::factory()->ownedBy($user)->create();
    $theirCar = Car::factory()->ownedBy($otherUser)->create();

    $this->actingAs($user);

    $this->get("/dashboard?car={$theirCar->id}")->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $myCar->id)
    );
});
