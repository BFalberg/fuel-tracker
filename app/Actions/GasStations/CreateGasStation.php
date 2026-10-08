<?php

declare(strict_types=1);

namespace App\Actions\GasStations;

use App\Models\GasStation;

final class CreateGasStation
{
    /**
     * @param  array{name: string, address: string}  $data
     */
    public function handle(array $data): GasStation
    {
        return GasStation::query()->create($data);
    }
}
