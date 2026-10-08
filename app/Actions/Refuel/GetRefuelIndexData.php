<?php

declare(strict_types=1);

namespace App\Actions\Refuel;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

final class GetRefuelIndexData
{
    /**
     * @return array{cars: Collection<int, Car>, gasStations: Collection<int, GasStation>}
     */
    public function handle(User $user): array
    {
        return [
            'cars' => $user->cars()->select(['cars.id', 'cars.name', 'cars.is_electric'])->get(),
            'gasStations' => GasStation::query()->select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->orderByRaw('COUNT(refuels.id) DESC')
                ->get(),
        ];
    }
}
