<?php

namespace App\Actions\CarExpenses;

use App\Models\CarExpense;

class DeleteCarExpense
{
    public function handle(CarExpense $expense): void
    {
        $expense->delete();
    }
}
