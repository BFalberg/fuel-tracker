<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

final readonly class GetRefuelFormData
{
    /**
     * @return array{cars: Collection<int, Car>, gasStations: Collection<int, GasStation>}
     */
    public function handle(User $user, bool $orderByLatestRefuel): array
    {
        $cars = $user->cars()->select(['cars.id', 'cars.name', 'cars.is_electric'])->get();

        if (! $orderByLatestRefuel) {
            return [
                'cars' => $cars,
                'gasStations' => GasStation::query()->select(['id', 'name'])->get(),
            ];
        }

        return [
            'cars' => $cars,
            'gasStations' => GasStation::query()->select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->orderByRaw('MAX(refuels.created_at) DESC')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->get(),
        ];
    }
}
