<?php

declare(strict_types=1);

use App\Actions\DeleteCar;
use App\Models\Car;

it('may delete a car', function (): void {
    $car = Car::factory()->create();

    resolve(DeleteCar::class)->handle($car);

    expect($car->exists)->toBeFalse();
});
