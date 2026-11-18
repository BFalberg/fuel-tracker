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
     * A refuel logged later, for example at home, is far from its station.
     */
    private const int MAX_MINUTES_SINCE_REFUEL_FOR_POSITION = 30;

    /**
     * The position the refuel was logged from places its station on the map,
     * but only when it was logged on the spot. It replaces any earlier
     * position, because an address lookup can be a street away and a real
     * visit is the better source, so the form can preselect it next time.
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

        $attributes['type'] = $car->is_electric ? 'charge' : 'fossil';

        unset($attributes['new_gas_station_name'], $attributes['new_gas_station_address'], $attributes['latitude'], $attributes['longitude']);

        return DB::transaction(function () use ($car, $attributes, $coordinates, $newStationName, $newStationAddress): Refuel {
            if (! empty($newStationName)) {
                $attributes['gas_station_id'] = GasStation::query()->create([
                    'name' => $newStationName,
                    'address' => $newStationAddress ?? 'Unknown',
                ])->id;
            }

            $refuel = $car->refuels()->create($attributes);

            if ($coordinates !== [] && $refuel->gas_station_id !== null && $this->isLoggedOnTheSpot($refuel)) {
                GasStation::query()->whereKey($refuel->gas_station_id)->update($coordinates);
            }

            return $refuel;
        });
    }

    private function isLoggedOnTheSpot(Refuel $refuel): bool
    {
        return $refuel->refueled_at->diffInMinutes(now(), true) <= self::MAX_MINUTES_SINCE_REFUEL_FOR_POSITION;
    }
}
