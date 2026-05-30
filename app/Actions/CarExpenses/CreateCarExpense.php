<?php

namespace App\Actions\CarExpenses;

use App\Models\Car;
use App\Models\CarExpense;

class CreateCarExpense
{
    /**
     * @param  array{expense_type: string, amount: float|int, description?: string|null, vendor?: string|null, invoice_date?: string|null}  $data
     */
    public function handle(Car $car, array $data): CarExpense
    {
        return $car->carExpenses()->create($data);
    }
}
