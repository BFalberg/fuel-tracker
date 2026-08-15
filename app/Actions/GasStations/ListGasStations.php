<?php

namespace App\Actions\GasStations;

use App\Models\GasStation;
use Illuminate\Database\Eloquent\Collection;

class ListGasStations
{
    /**
     * The refuel count is exposed so the delete confirmation can state how many
     * refuels will lose their station reference.
     *
     * @return Collection<int, GasStation>
     */
    public function handle(): Collection
    {
        return GasStation::withCount('refuels')->latest()->get();
    }
}
