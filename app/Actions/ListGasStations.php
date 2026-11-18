<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Support\Collection;

final readonly class ListGasStations
{
    /**
     * The refuel count is exposed so the delete confirmation can state how many
     * refuels will lose their station reference. A station another user's car
     * depends on cannot be managed, mirroring the GasStationPolicy.
     *
     * @return Collection<int, array{id: int, name: string, address: string, refuels_count: int<0, max>, can_manage: bool}>
     */
    public function handle(User $user): Collection
    {
        $stationIdsUsedByOthers = Refuel::query()->inaccessibleTo($user)
            ->whereNotNull('gas_station_id')
            ->distinct()
            ->pluck('gas_station_id');

        return GasStation::query()
            ->withCount('refuels')
            ->latest()
            ->get()
            ->map(fn (GasStation $station): array => [
                'id' => $station->id,
                'name' => $station->name,
                'address' => $station->address,
                'refuels_count' => $station->refuels_count,
                'can_manage' => ! $stationIdsUsedByOthers->contains($station->id),
            ])
            ->toBase();
    }
}
