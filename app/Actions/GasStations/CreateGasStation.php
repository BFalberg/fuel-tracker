<?php

namespace App\Actions\GasStations;

use App\Models\GasStation;

class CreateGasStation
{
    /**
     * @param  array{name: string, address: string}  $data
     */
    public function handle(array $data): GasStation
    {
        return GasStation::create($data);
    }
}
