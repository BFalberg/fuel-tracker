<?php

namespace App\Policies;

use App\Models\Refuel;
use App\Models\User;

/**
 * A refuel belongs to a car, as a single shared ledger. Every member of that
 * car — owner or co-driver — may view, edit and delete any refuel on it.
 */
class RefuelPolicy
{
    /**
     * The listing is filtered by Refuel::scopeAccessibleBy(); a policy cannot
     * scope a collection, so this only gates access to the page itself.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Refuel $refuel): bool
    {
        return $this->belongsToUsersCar($user, $refuel);
    }

    /**
     * Creation is authorized against the target car in RefuelController::store,
     * because the car is only known from the request payload.
     */
    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Refuel $refuel): bool
    {
        return $this->belongsToUsersCar($user, $refuel);
    }

    public function delete(User $user, Refuel $refuel): bool
    {
        return $this->belongsToUsersCar($user, $refuel);
    }

    public function restore(User $user, Refuel $refuel): bool
    {
        return false;
    }

    public function forceDelete(User $user, Refuel $refuel): bool
    {
        return false;
    }

    private function belongsToUsersCar(User $user, Refuel $refuel): bool
    {
        return $user->cars()->where('cars.id', $refuel->car_id)->exists();
    }
}
