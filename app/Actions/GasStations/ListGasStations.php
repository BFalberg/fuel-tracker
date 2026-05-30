<?php

namespace App\Actions\GasStations;

use App\Models\GasStation;
use Illuminate\Database\Eloquent\Collection;

class ListGasStations
{
    public function handle(): Collection
    {
        return GasStation::latest()->get();
    }
}
