<?php

declare(strict_types=1);

use App\Actions\ListGasStations;
use App\Models\GasStation;
use App\Models\Refuel;

it('lists the newest gas stations first with their refuel count', function (): void {
    $older = GasStation::factory()->create(['created_at' => now()->subDay()]);
    $newer = GasStation::factory()->create(['created_at' => now()]);
    Refuel::factory()->count(2)->atStation($older)->create();

    $stations = resolve(ListGasStations::class)->handle();

    expect($stations->pluck('id')->all())->toBe([$newer->id, $older->id])
        ->and($stations[1]->getAttribute('refuels_count'))->toBe(2);
});
