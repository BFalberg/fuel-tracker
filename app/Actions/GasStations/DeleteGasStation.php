<?php

declare(strict_types=1);

namespace App\Actions\GasStations;

use App\Models\GasStation;

final class DeleteGasStation
{
    public function handle(GasStation $gasStation): void
    {
        $gasStation->delete();
    }
}
