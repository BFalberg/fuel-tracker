<?php

declare(strict_types=1);

namespace App\Actions\Refuel;

use App\Models\Refuel;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

final class ListRefuels
{
    /**
     * @return LengthAwarePaginator<int, Refuel>
     */
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
