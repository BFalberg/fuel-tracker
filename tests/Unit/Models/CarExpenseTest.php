<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\CarExpense;

it('belongs to a car', function (): void {
    $car = Car::factory()->create();
    $expense = CarExpense::factory()->forCar($car)->create();

    expect($expense->car->is($car))->toBeTrue();
});
