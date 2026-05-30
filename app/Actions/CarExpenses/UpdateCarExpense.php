<?php

namespace App\Actions\CarExpenses;

use App\Models\CarExpense;

class UpdateCarExpense
{
    /**
     * @param  array{expense_type: string, amount: float|int, description?: string|null, vendor?: string|null, invoice_date?: string|null}  $data
     */
    public function handle(CarExpense $expense, array $data): CarExpense
    {
        $expense->update($data);

        return $expense;
    }
}
