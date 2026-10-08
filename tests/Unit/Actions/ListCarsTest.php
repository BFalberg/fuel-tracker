<?php

declare(strict_types=1);

use App\Actions\ListCars;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\User;

it('lists the cars of the user with their owner and role', function (): void {
    $owner = User::factory()->create(['name' => 'Owner']);
    $coDriver = User::factory()->create();
    $sharedCar = Car::factory()->ownedBy($owner)->create(['created_at' => now()->subDay()]);
    $sharedCar->users()->attach($coDriver->id, ['role' => 'co_driver']);
    CarExpense::factory()->forCar($sharedCar)->create();
    $ownCar = Car::factory()->ownedBy($coDriver)->create(['created_at' => now()]);
    Car::factory()->ownedBy(User::factory()->create())->create();

    $cars = resolve(ListCars::class)->handle($coDriver);

    expect($cars)->toHaveCount(2)
        ->and($cars[0]['id'])->toBe($ownCar->id)
        ->and($cars[0]['pivot'])->toBe(['role' => 'owner'])
        ->and($cars[0]['can_delete'])->toBeTrue()
        ->and($cars[1]['id'])->toBe($sharedCar->id)
        ->and($cars[1]['pivot'])->toBe(['role' => 'co_driver'])
        ->and($cars[1]['can_delete'])->toBeFalse()
        ->and($cars[1]['users']->all())->toBe([['id' => $owner->id, 'name' => 'Owner']]);
});
