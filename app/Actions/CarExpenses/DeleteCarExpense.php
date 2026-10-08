<?php

declare(strict_types=1);

namespace App\Actions\CarExpenses;

use App\Models\CarExpense;

final class DeleteCarExpense
{
    public function handle(CarExpense $expense): void
    {
        $expense->delete();
    }
}
