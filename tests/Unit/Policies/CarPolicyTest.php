<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\User;
use App\Policies\CarPolicy;

it('gives the owner full access and a co-driver view access', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $policy = new CarPolicy;

    expect($policy->view($owner, $car))->toBeTrue()
        ->and($policy->update($owner, $car))->toBeTrue()
        ->and($policy->delete($owner, $car))->toBeTrue()
        ->and($policy->manageUsers($owner, $car))->toBeTrue()
        ->and($policy->view($coDriver, $car))->toBeTrue()
        ->and($policy->update($coDriver, $car))->toBeFalse()
        ->and($policy->delete($coDriver, $car))->toBeFalse()
        ->and($policy->manageUsers($coDriver, $car))->toBeFalse()
        ->and($policy->view($stranger, $car))->toBeFalse();
});

it('allows listing and creating cars but never restoring them', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $policy = new CarPolicy;

    expect($policy->viewAny($user))->toBeTrue()
        ->and($policy->create($user))->toBeTrue()
        ->and($policy->restore($user, $car))->toBeFalse()
        ->and($policy->forceDelete($user, $car))->toBeFalse();
});
