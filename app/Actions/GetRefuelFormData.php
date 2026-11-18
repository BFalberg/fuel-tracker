<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

final readonly class GetRefuelFormData
{
    /**
     * A new refuel is logged on a car that is still driven, so archived cars
     * are left out and the most recently refuelled car comes first, ready to
     * be preselected. Each car carries its last odometer reading, and each
     * station the charge type last used there, so the form can preselect both.
     *
     * @return array{cars: Collection<int, Car>, gasStations: Collection<int, GasStation>}
     */
    public function handle(User $user, bool $isCreating): array
    {
        if (! $isCreating) {
            return [
                'cars' => $user->cars()->select(['cars.id', 'cars.name', 'cars.is_electric'])->get(),
                'gasStations' => GasStation::query()->select(['id', 'name'])->get(),
            ];
        }

        return [
            'cars' => $user->cars()->active()
                ->select(['cars.id', 'cars.name', 'cars.is_electric'])
                ->withMax('refuels as last_mileage', 'mileage')
                ->withMax('refuels as last_refueled_at', 'refueled_at')
                ->orderByDesc('last_refueled_at')
                ->withCasts(['last_mileage' => 'integer'])
                ->get(),
            'gasStations' => GasStation::query()->select(['gas_stations.id', 'gas_stations.name', 'gas_stations.latitude', 'gas_stations.longitude'])
                ->addSelect(['last_charge_type' => Refuel::query()->select('charge_type')
                    ->whereColumn('gas_station_id', 'gas_stations.id')
                    ->whereNotNull('charge_type')
                    ->latest('refueled_at')
                    ->limit(1)])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->orderByRaw('MAX(refuels.refueled_at) DESC')
                ->groupBy('gas_stations.id', 'gas_stations.name', 'gas_stations.latitude', 'gas_stations.longitude')
                ->get(),
        ];
    }
}
