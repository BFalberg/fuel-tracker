<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\GasStation;
use App\Models\User;

/**
 * Stations are shared by everyone, so a user may only change a station that no
 * other user's car depends on. Otherwise any account could rename or delete
 * the stations behind someone else's refuel history.
 */
final class GasStationPolicy
{
    public function update(User $user, GasStation $gasStation): bool
    {
        return $this->isUsedOnlyByUsersCars($user, $gasStation);
    }

    public function delete(User $user, GasStation $gasStation): bool
    {
        return $this->isUsedOnlyByUsersCars($user, $gasStation);
    }

    private function isUsedOnlyByUsersCars(User $user, GasStation $gasStation): bool
    {
        return ! $gasStation->refuels()->inaccessibleTo($user)->exists();
    }
}
