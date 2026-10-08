<?php

declare(strict_types=1);

use App\Actions\UpdateCar;
use App\Models\Car;

it('may update a car', function (): void {
    $car = Car::factory()->create(['name' => 'Old', 'sale_price' => 100]);

    $updated = resolve(UpdateCar::class)->handle($car, ['name' => 'New']);

    expect($updated->refresh()->name)->toBe('New')
        ->and($updated->sale_price)->toBe('100.00');
});
