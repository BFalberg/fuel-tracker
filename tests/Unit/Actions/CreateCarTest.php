<?php

declare(strict_types=1);

use App\Actions\CreateCar;
use App\Models\CarUser;
use App\Models\User;

it('may create a car owned by the user', function (): void {
    $user = User::factory()->create();

    $car = resolve(CreateCar::class)->handle($user, [
        'name' => 'Family car',
        'registration_number' => 'AB12345',
        'is_electric' => false,
    ]);

    $owner = $car->users()->sole();

    expect($car->name)->toBe('Family car')
        ->and($owner->is($user))->toBeTrue()
        ->and(CarUser::of($owner)->role)->toBe('owner');
});
