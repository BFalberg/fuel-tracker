<?php

declare(strict_types=1);

use App\Actions\DeleteCarExpense;
use App\Models\CarExpense;

it('may delete an expense', function (): void {
    $expense = CarExpense::factory()->create();

    resolve(DeleteCarExpense::class)->handle($expense);

    expect($expense->exists)->toBeFalse();
});
