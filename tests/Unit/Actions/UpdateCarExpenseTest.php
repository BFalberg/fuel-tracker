<?php

declare(strict_types=1);

use App\Actions\UpdateCarExpense;
use App\Models\CarExpense;

it('may update an expense', function (): void {
    $expense = CarExpense::factory()->create(['amount' => 100]);

    $updated = resolve(UpdateCarExpense::class)->handle($expense, ['amount' => 250]);

    expect($updated->refresh()->amount)->toBe('250.00');
});
