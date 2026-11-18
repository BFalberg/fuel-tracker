<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use Illuminate\Support\Facades\DB;

final readonly class CreateRefuel
{
    /**
     * The position the refuel was logged from places its station on the map.
     * A new station takes it, and an existing station without coordinates
     * learns them, so the form can preselect it next time. Known coordinates
     * are never moved.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Car $car, array $attributes): Refuel
    {
        $coordinates = isset($attributes['latitude'], $attributes['longitude'])
            ? ['latitude' => $attributes['latitude'], 'longitude' => $attributes['longitude']]
            : [];

        $newStationName = $attributes['new_gas_station_name'] ?? null;
        $newStationAddress = $attributes['new_gas_station_address'] ?? null;

        unset($attributes['new_gas_station_name'], $attributes['new_gas_station_address'], $attributes['latitude'], $attributes['longitude']);

        return DB::transaction(function () use ($car, $attributes, $coordinates, $newStationName, $newStationAddress): Refuel {
            if (! empty($newStationName)) {
                $attributes['gas_station_id'] = GasStation::query()->create([
                    'name' => $newStationName,
                    'address' => $newStationAddress ?? 'Unknown',
                    ...$coordinates,
                ])->id;
            } elseif ($coordinates !== [] && isset($attributes['gas_station_id'])) {
                GasStation::query()->whereKey($attributes['gas_station_id'])
                    ->whereNull('latitude')
                    ->update($coordinates);
            }

            return $car->refuels()->create($attributes);
        });
    }
}
