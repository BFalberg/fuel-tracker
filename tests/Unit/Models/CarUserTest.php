<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\CarUser;
use App\Models\User;

it('returns the membership of a car loaded through the car_user relation', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $membership = CarUser::of($user->cars()->sole());

    expect($membership->user_id)->toBe($user->id)
        ->and($membership->role)->toBe('owner');
});

it('throws when the model was not loaded through the car_user relation', function (): void {
    $car = Car::factory()->create();

    CarUser::of($car);
})->throws(LogicException::class, 'The model was not loaded through the car_user relation.');
