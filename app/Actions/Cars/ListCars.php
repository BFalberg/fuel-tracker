<?php

declare(strict_types=1);

namespace App\Actions\Cars;

use App\Models\Car;
use App\Models\CarUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

final class ListCars
{
    /**
     * @return Collection<int, array{id: int, name: string, registration_number: string, is_electric: bool, users: Collection<int, array{id: int, name: string}>, pivot: array{role: 'owner'|'co_driver'}, can_delete: bool}>
     */
    public function handle(User $user): Collection
    {
        return $user->cars()
            ->withCount(['refuels', 'carExpenses'])
            ->with(['users' => fn (BelongsToMany $q): BelongsToMany => $q->wherePivot('role', 'owner')->select('users.id', 'users.name')])
            ->latest('cars.created_at')
            ->get(['cars.id', 'cars.name', 'cars.registration_number', 'cars.is_electric'])
            ->map(fn (Car $car): array => [
                'id' => $car->id,
                'name' => $car->name,
                'registration_number' => $car->registration_number,
                'is_electric' => $car->is_electric,
                'users' => $car->users->map(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                ])->values(),
                'pivot' => ['role' => CarUser::of($car)->role],
                'can_delete' => $car->refuels_count === 0 && $car->car_expenses_count === 0,
            ]);
    }
}
