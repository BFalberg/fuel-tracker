<?php

declare(strict_types=1);

use App\Actions\CreateCarExpense;
use App\Enums\ExpenseType;
use App\Models\Car;

it('may create an expense on a car', function (): void {
    $car = Car::factory()->create();

    $expense = resolve(CreateCarExpense::class)->handle($car, [
        'expense_type' => 'Afgift',
        'amount' => 1000,
    ]);

    expect($expense->car_id)->toBe($car->id)
        ->and($expense->expense_type)->toBe(ExpenseType::Tax)
        ->and($expense->amount)->toBe('1000.00');
});
