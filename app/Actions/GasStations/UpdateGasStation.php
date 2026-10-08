<?php

declare(strict_types=1);

namespace App\Actions\GasStations;

use App\Models\GasStation;

final class UpdateGasStation
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
