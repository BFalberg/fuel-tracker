<?php

namespace App\Actions\Refuel;

use App\Models\Refuel;

class DeleteRefuel
{
    public function handle(Refuel $refuel): void
    {
        $refuel->delete();
    }
}
