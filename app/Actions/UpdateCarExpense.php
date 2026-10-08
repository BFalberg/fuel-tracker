<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\CarExpense;

final readonly class UpdateCarExpense
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(CarExpense $expense, array $attributes): CarExpense
    {
        $expense->update($attributes);

        return $expense;
    }
}
