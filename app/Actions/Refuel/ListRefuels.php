<?php

namespace App\Actions\Refuel;

use App\Models\Refuel;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class ListRefuels
{
    public function handle(User $user, ?int $selectedCarId = null): LengthAwarePaginator
    {
        return Refuel::with(['car', 'gasStation'])
            ->accessibleBy($user)
            ->when($selectedCarId, function ($query) use ($selectedCarId): void {
                $query->where('car_id', $selectedCarId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }
}
