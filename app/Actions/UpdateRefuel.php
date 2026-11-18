<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\GasStation;
use App\Models\Refuel;

final readonly class UpdateRefuel
{
    /**
     * The refuel's car is never taken from the payload — a refuel cannot move
     * between cars, so the existing relationship is authoritative.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Refuel $refuel, array $attributes): Refuel
    {
        if (! empty($attributes['new_gas_station_name'])) {
            $station = GasStation::query()->create([
                'name' => $attributes['new_gas_station_name'],
                'address' => $attributes['new_gas_station_address'] ?? 'Unknown',
            ]);

            $attributes['gas_station_id'] = $station->id;
        }

        $attributes['type'] = $refuel->car->is_electric ? 'charge' : 'fossil';

        unset($attributes['new_gas_station_name'], $attributes['new_gas_station_address']);

        $refuel->update($attributes);

        return $refuel;
    }
}
