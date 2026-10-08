<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\CarExpense;

final readonly class DeleteCarExpense
{
    public function handle(CarExpense $expense): void
    {
        $expense->delete();
    }
}
