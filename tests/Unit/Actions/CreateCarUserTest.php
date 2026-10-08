<?php

declare(strict_types=1);

use App\Actions\CreateCarUser;
use App\Models\Car;
use App\Models\CarUser;
use App\Models\User;

it('adds the user to the car as a co-driver', function (): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create();
    $user = User::factory()->create();

    resolve(CreateCarUser::class)->handle($car, $user);

    $member = $car->users()->whereKey($user->id)->sole();

    expect(CarUser::of($member)->role)->toBe('co_driver');
});
