<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Support\Facades\DB;

final readonly class CreateRefuel
{
    /**
     * A refuel logged later, for example at home, is far from its station.
     */
    private const int MAX_MINUTES_SINCE_REFUEL_FOR_POSITION = 30;

    /**
     * The position the refuel was logged from places its station on the map,
     * but only when it was logged on the spot. A new station takes it, and an
     * existing station without coordinates learns them, so the form can
     * preselect it next time. Known coordinates are never moved.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Car $car, array $attributes): Refuel
    {
        $coordinates = $this->isLoggedOnTheSpot($attributes) && isset($attributes['latitude'], $attributes['longitude'])
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

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function isLoggedOnTheSpot(array $attributes): bool
    {
        $refueledAt = $attributes['refueled_at'] ?? null;

        if (! is_string($refueledAt) && ! $refueledAt instanceof DateTimeInterface) {
            return false;
        }

        return CarbonImmutable::parse($refueledAt)->diffInMinutes(CarbonImmutable::now(), true) <= self::MAX_MINUTES_SINCE_REFUEL_FOR_POSITION;
    }
}
