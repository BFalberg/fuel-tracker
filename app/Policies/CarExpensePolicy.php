<?php

namespace App\Policies;

use App\Models\CarExpense;
use App\Models\User;

/**
 * Car expenses follow the same rule as refuels: they belong to the car, and
 * every member of that car — owner or co-driver — may manage them.
 */
class CarExpensePolicy
{
    public function view(User $user, CarExpense $expense): bool
    {
        return $this->belongsToUsersCar($user, $expense);
    }

    public function update(User $user, CarExpense $expense): bool
    {
        return $this->belongsToUsersCar($user, $expense);
    }

    public function delete(User $user, CarExpense $expense): bool
    {
        return $this->belongsToUsersCar($user, $expense);
    }

    public function restore(User $user, CarExpense $expense): bool
    {
        return false;
    }

    public function forceDelete(User $user, CarExpense $expense): bool
    {
        return false;
    }

    private function belongsToUsersCar(User $user, CarExpense $expense): bool
    {
        return $user->cars()->where('cars.id', $expense->car_id)->exists();
    }
}
