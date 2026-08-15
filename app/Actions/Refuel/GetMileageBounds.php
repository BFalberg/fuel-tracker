<?php

namespace App\Actions\Refuel;

use App\Models\Refuel;

class GetMileageBounds
{
    /**
     * The refuel's neighbours in its car's odometer series, anchored on the
     * mileage currently stored — never on a submitted value. This is what lets
     * a refuel be corrected inside the slot it already occupies without ever
     * being dragged past a sibling.
     *
     * Either bound is null when the refuel is the first or last of the series.
     *
     * @return array{min: int|null, max: int|null}
     */
    public function handle(Refuel $refuel): array
    {
        $previous = Refuel::where('car_id', $refuel->car_id)
            ->whereKeyNot($refuel->getKey())
            ->where('mileage', '<', $refuel->mileage)
            ->max('mileage');

        $next = Refuel::where('car_id', $refuel->car_id)
            ->whereKeyNot($refuel->getKey())
            ->where('mileage', '>', $refuel->mileage)
            ->min('mileage');

        return [
            'min' => $previous !== null ? (int) $previous : null,
            'max' => $next !== null ? (int) $next : null,
        ];
    }
}
