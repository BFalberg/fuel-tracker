<?php

namespace App\Actions\Refuel;

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
            'cars' => auth()->user()->cars()->select(['cars.id', 'cars.name', 'cars.is_electric'])->get(),
            'gasStations' => GasStation::select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->orderByRaw('COUNT(refuels.id) DESC')
                ->get(),
        ];
    }
}
