<?php

declare(strict_types=1);

use App\Actions\DeleteRefuel;
use App\Models\Refuel;

it('may delete a refuel', function (): void {
    $refuel = Refuel::factory()->create();

    resolve(DeleteRefuel::class)->handle($refuel);

    expect($refuel->exists)->toBeFalse();
});
