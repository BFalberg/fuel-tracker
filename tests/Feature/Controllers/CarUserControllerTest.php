<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\User;

it('lets the owner add a co-driver by email', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create(['email' => 'codriver@example.com']);
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->post(route('cars.users.store', $car), ['email' => 'codriver@example.com'])
        ->assertRedirect()
        ->assertSessionHas('success', 'Co-driver added successfully.');

    expect($car->users()->where('users.id', $coDriver->id)->wherePivot('role', 'co_driver')->exists())->toBeTrue();
});

it('gives one error for an unknown email and an existing member', function (string $email): void {
    $owner = User::factory()->create(['email' => 'owner@example.com']);
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->post(route('cars.users.store', $car), ['email' => $email])
        ->assertSessionHasErrors(['email' => 'That email address could not be added as a co-driver.']);

    expect($car->users()->count())->toBe(1);
})->with([
    'unknown email' => 'nobody@example.com',
    'existing member' => 'owner@example.com',
]);

it('does not let a co-driver add other users', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    User::factory()->create(['email' => 'stranger@example.com']);
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->post(route('cars.users.store', $car), ['email' => 'stranger@example.com'])
        ->assertForbidden();
});

it('lets the owner remove a co-driver', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($owner)
        ->delete(route('cars.users.destroy', [$car, $coDriver]))
        ->assertRedirect()
        ->assertSessionHas('success', 'Co-driver removed successfully.');

    expect($car->users()->where('users.id', $coDriver->id)->exists())->toBeFalse();
});

it('does not let the owner remove themselves', function (): void {
    $owner = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->delete(route('cars.users.destroy', [$car, $owner]))
        ->assertSessionHasErrors('user');

    expect($car->users()->count())->toBe(1);
});
