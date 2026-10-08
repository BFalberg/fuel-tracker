<?php

declare(strict_types=1);

use App\Actions\DeleteCarUser;
use App\Models\Car;
use App\Models\User;

it('removes the user from the car', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    resolve(DeleteCarUser::class)->handle($car, $coDriver);

    expect($car->users()->pluck('users.id')->all())->toBe([$owner->id]);
});
