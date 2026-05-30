<?php

namespace App\Actions\Refuel;

use App\Models\Refuel;
use Illuminate\Pagination\LengthAwarePaginator;

class ListRefuels
{
    public function handle(?int $selectedCarId = null): LengthAwarePaginator
    {
        return Refuel::with(['car', 'gasStation'])
            ->when($selectedCarId, function ($query) use ($selectedCarId): void {
                $query->where('car_id', $selectedCarId);
            })
            ->latest()
            ->paginate(10);
    }
}
