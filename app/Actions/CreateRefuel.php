<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;

final readonly class CreateRefuel
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Car $car, array $attributes): Refuel
    {
        if (! empty($attributes['new_gas_station_name'])) {
            $station = GasStation::query()->create([
                'name' => $attributes['new_gas_station_name'],
                'address' => $attributes['new_gas_station_address'] ?? 'Unknown',
            ]);

            $attributes['gas_station_id'] = $station->id;
        }

        $attributes['type'] = $car->is_electric ? 'charge' : 'fossil';

        unset($attributes['new_gas_station_name'], $attributes['new_gas_station_address']);

        return $car->refuels()->create($attributes);
    }
}
