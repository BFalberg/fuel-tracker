<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\Refuel;
use App\Models\User;
use App\Policies\RefuelPolicy;

it('lets every member of the car manage its refuels', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);
    $refuel = Refuel::factory()->forCar($car)->create();

    $policy = new RefuelPolicy;

    foreach ([$owner, $coDriver] as $member) {
        expect($policy->view($member, $refuel))->toBeTrue()
            ->and($policy->update($member, $refuel))->toBeTrue()
            ->and($policy->delete($member, $refuel))->toBeTrue();
    }

    expect($policy->view($stranger, $refuel))->toBeFalse()
        ->and($policy->update($stranger, $refuel))->toBeFalse()
        ->and($policy->delete($stranger, $refuel))->toBeFalse();
});

it('allows listing and creating refuels but never restoring them', function (): void {
    $user = User::factory()->create();
    $refuel = Refuel::factory()->create();

    $policy = new RefuelPolicy;

    expect($policy->viewAny($user))->toBeTrue()
        ->and($policy->create($user))->toBeTrue()
        ->and($policy->restore($user, $refuel))->toBeFalse()
        ->and($policy->forceDelete($user, $refuel))->toBeFalse();
});
