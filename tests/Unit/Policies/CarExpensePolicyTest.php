<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\User;
use App\Policies\CarExpensePolicy;

it('lets every member of the car manage its expenses', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);
    $expense = CarExpense::factory()->forCar($car)->create();

    $policy = new CarExpensePolicy;

    foreach ([$owner, $coDriver] as $member) {
        expect($policy->view($member, $expense))->toBeTrue()
            ->and($policy->update($member, $expense))->toBeTrue()
            ->and($policy->delete($member, $expense))->toBeTrue();
    }

    expect($policy->view($stranger, $expense))->toBeFalse()
        ->and($policy->update($stranger, $expense))->toBeFalse()
        ->and($policy->delete($stranger, $expense))->toBeFalse()
        ->and($policy->restore($owner, $expense))->toBeFalse()
        ->and($policy->forceDelete($owner, $expense))->toBeFalse();
});
