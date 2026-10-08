<?php

declare(strict_types=1);

use App\Actions\CreateGasStation;

it('may create a gas station', function (): void {
    $station = resolve(CreateGasStation::class)->handle([
        'name' => 'Circle K',
        'address' => 'Nørre Voldgade 1',
    ]);

    expect($station->exists)->toBeTrue()
        ->and($station->only('name', 'address'))->toBe(['name' => 'Circle K', 'address' => 'Nørre Voldgade 1']);
});
