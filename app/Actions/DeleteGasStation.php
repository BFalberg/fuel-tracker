<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\GasStation;

final readonly class DeleteGasStation
{
    public function handle(GasStation $gasStation): void
    {
        $gasStation->delete();
    }
}
