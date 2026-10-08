<?php

declare(strict_types=1);

namespace App\Actions\Refuel;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;

final class CreateRefuel
{
    /**
     * @param  array{car_id: int, gas_station_id?: int|null, new_gas_station_name?: string|null, new_gas_station_address?: string|null, liters_refueled: float|int, total_price: float|int, mileage: int}  $data
     */
    public function handle(array $data): Refuel
    {
        $car = Car::query()->select(['id', 'is_electric'])->findOrFail($data['car_id']);

        if (! empty($data['new_gas_station_name'])) {
            $station = GasStation::query()->create([
                'name' => $data['new_gas_station_name'],
                'address' => $data['new_gas_station_address'] ?? 'Unknown',
            ]);

            $data['gas_station_id'] = $station->id;
        }

        $data['type'] = $car->is_electric ? 'charge' : 'fossil';

        unset($data['new_gas_station_name'], $data['new_gas_station_address']);

        return Refuel::query()->create($data);
    }
}
