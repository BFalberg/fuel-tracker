<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\GasStation;

final readonly class UpdateGasStation
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(GasStation $gasStation, array $attributes): GasStation
    {
        $gasStation->update($attributes);

        return $gasStation;
    }
}
