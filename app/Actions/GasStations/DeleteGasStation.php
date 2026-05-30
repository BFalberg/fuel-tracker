<?php

namespace App\Actions\GasStations;

use App\Models\GasStation;

class DeleteGasStation
{
    public function handle(GasStation $gasStation): void
    {
        $gasStation->delete();
    }
}
