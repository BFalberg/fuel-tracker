<?php

declare(strict_types=1);

namespace App\Actions\CarExpenses;

use App\Models\Car;
use App\Models\CarExpense;

final class CreateCarExpense
{
    /**
     * @param  array{expense_type: string, amount: float|int, description?: string|null, vendor?: string|null, invoice_date?: string|null}  $data
     */
    public function handle(Car $car, array $data): CarExpense
    {
        return $car->carExpenses()->create($data);
    }
}
