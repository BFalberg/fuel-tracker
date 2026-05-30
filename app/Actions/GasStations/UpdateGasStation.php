<?php

namespace App\Actions\GasStations;

use App\Models\GasStation;

class UpdateGasStation
{
    /**
     * @param  array{name: string, address: string}  $data
     */
    public function handle(GasStation $gasStation, array $data): GasStation
    {
        $gasStation->update($data);

        return $gasStation;
    }
}
