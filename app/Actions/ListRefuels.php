<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Refuel;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

final readonly class ListRefuels
{
    /**
     * @return LengthAwarePaginator<int, Refuel>
     */
    public function handle(User $user, ?int $selectedCarId = null): LengthAwarePaginator
    {
        return Refuel::with(['car', 'gasStation'])
            ->accessibleBy($user)
            ->when($selectedCarId, function (Builder $query) use ($selectedCarId): void {
                $query->where('car_id', $selectedCarId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }
}
