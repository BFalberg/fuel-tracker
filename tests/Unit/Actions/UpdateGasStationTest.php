<?php

declare(strict_types=1);

use App\Actions\UpdateGasStation;
use App\Models\GasStation;

it('may update a gas station', function (): void {
    $station = GasStation::factory()->create();

    $updated = resolve(UpdateGasStation::class)->handle($station, ['name' => 'Q8 Valby']);

    expect($updated->refresh()->name)->toBe('Q8 Valby');
});
