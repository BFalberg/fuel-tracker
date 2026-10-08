<?php

declare(strict_types=1);

use App\Actions\DeleteGasStation;
use App\Models\GasStation;

it('may delete a gas station', function (): void {
    $station = GasStation::factory()->create();

    resolve(DeleteGasStation::class)->handle($station);

    expect($station->exists)->toBeFalse();
});
