<?php

declare(strict_types=1);

namespace App\Actions\CarExpenses;

use App\Models\CarExpense;

final class UpdateCarExpense
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
