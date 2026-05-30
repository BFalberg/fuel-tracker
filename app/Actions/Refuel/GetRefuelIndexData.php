<?php

namespace App\Actions\Refuel;

use App\Models\Car;
use App\Models\GasStation;
use Illuminate\Support\Collection;

class GetRefuelIndexData
{
    /**
     * @return array{cars: Collection, gasStations: Collection}
     */
    public function handle(): array
    {
        return [
            'cars' => Car::select(['id', 'name', 'is_electric'])->get(),
            'gasStations' => GasStation::select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->orderByRaw('COUNT(refuels.id) DESC')
                ->get(),
        ];
    }
}
