<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\GasStation;

final readonly class CreateGasStation
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(array $attributes): GasStation
    {
        return GasStation::query()->create($attributes);
    }
}
