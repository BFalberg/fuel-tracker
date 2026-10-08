<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Refuel;

final readonly class DeleteRefuel
{
    public function handle(Refuel $refuel): void
    {
        $refuel->delete();
    }
}
