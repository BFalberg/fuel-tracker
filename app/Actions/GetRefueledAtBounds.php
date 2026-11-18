<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Refuel;
use Carbon\CarbonInterface;

final readonly class GetRefueledAtBounds
{
    /**
     * The dates of the refuel's neighbours in its car's odometer series. The
     * neighbours are the same ones GetMileageBounds anchors on, so a refuel's
     * date must keep the order its mileage already has.
     *
     * Either bound is null when the refuel is the first or last of the series.
     *
     * @return array{min: CarbonInterface|null, max: CarbonInterface|null}
     */
    public function handle(Refuel $refuel): array
    {
        $previous = Refuel::query()->where('car_id', $refuel->car_id)
            ->whereKeyNot($refuel->getKey())
            ->where('mileage', '<', $refuel->mileage)
            ->orderByDesc('mileage')
            ->first(['refueled_at']);

        $next = Refuel::query()->where('car_id', $refuel->car_id)
            ->whereKeyNot($refuel->getKey())
            ->where('mileage', '>', $refuel->mileage)
            ->orderBy('mileage')
            ->first(['refueled_at']);

        return [
            'min' => $previous?->refueled_at,
            'max' => $next?->refueled_at,
        ];
    }
}
