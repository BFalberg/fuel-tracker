<?php

namespace App\Actions\Cars;

use App\Models\Car;
use Illuminate\Support\Collection;

class ListCars
{
    /**
     * @return Collection<int, array{id: int, name: string, registration_number: string, is_electric: bool, users: Collection<int, array{id: int, name: string}>, pivot: array{role: string}, can_delete: bool}>
     */
    public function handle(): Collection
    {
        return auth()->user()->cars()
            ->withCount(['refuels', 'carExpenses'])
            ->with(['users' => fn ($q) => $q->wherePivot('role', 'owner')->select('users.id', 'users.name')])
            ->latest('cars.created_at')
            ->get(['cars.id', 'cars.name', 'cars.registration_number', 'cars.is_electric'])
            ->map(fn (Car $car): array => [
                'id' => $car->id,
                'name' => $car->name,
                'registration_number' => $car->registration_number,
                'is_electric' => $car->is_electric,
                'users' => $car->users->map(fn ($user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                ])->values(),
                'pivot' => ['role' => $car->pivot->role],
                'can_delete' => $car->refuels_count === 0 && $car->car_expenses_count === 0,
            ]);
    }
}
