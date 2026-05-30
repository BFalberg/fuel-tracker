<?php

namespace App\Actions\Refuel;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;

class UpdateRefuel
{
    /**
     * @param  array{car_id: int, gas_station_id?: int|null, new_gas_station_name?: string|null, new_gas_station_address?: string|null, liters_refueled: float|int, total_price: float|int, mileage: int}  $data
     */
    public function handle(Refuel $refuel, array $data): Refuel
    {
        $car = Car::select(['id', 'is_electric'])->findOrFail($data['car_id']);

        if (! empty($data['new_gas_station_name'])) {
            $station = GasStation::create([
                'name' => $data['new_gas_station_name'],
                'address' => $data['new_gas_station_address'] ?? 'Unknown',
            ]);

            $data['gas_station_id'] = $station->id;
        }

        $data['type'] = $car->is_electric ? 'charge' : 'fossil';

        unset($data['new_gas_station_name'], $data['new_gas_station_address']);

        $refuel->update($data);

        return $refuel;
    }
}
