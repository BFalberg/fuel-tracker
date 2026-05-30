<?php

namespace App\Actions\Refuel;

use App\Models\Car;
use App\Models\GasStation;
use Illuminate\Support\Collection;

class GetRefuelFormData
{
    /**
     * @return array{cars: Collection, gasStations: Collection}
     */
    public function handle(bool $orderByLatestRefuel): array
    {
        $cars = Car::select(['id', 'name', 'is_electric'])->get();

        if (! $orderByLatestRefuel) {
            return [
                'cars' => $cars,
                'gasStations' => GasStation::select(['id', 'name'])->get(),
            ];
        }

        return [
            'cars' => $cars,
            'gasStations' => GasStation::select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->orderByRaw('MAX(refuels.created_at) DESC')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->get(),
        ];
    }
}
