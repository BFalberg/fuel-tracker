<?php

declare(strict_types=1);

namespace App\Actions\Refuel;

use App\Models\Refuel;

final class DeleteRefuel
{
    public function handle(Refuel $refuel): void
    {
        $refuel->delete();
    }
}
