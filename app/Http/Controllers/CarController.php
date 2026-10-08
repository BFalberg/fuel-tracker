<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateCar;
use App\Actions\DeleteCar;
use App\Actions\ListCars;
use App\Actions\ShowCar;
use App\Actions\UpdateCar;
use App\Http\Requests\CreateCarRequest;
use App\Http\Requests\UpdateCarRequest;
use App\Models\Car;
use App\Models\CarUser;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

final readonly class CarController
{
    public function index(#[CurrentUser] User $user, ListCars $action): Response
    {
        return Inertia::render('car/index', [
            'cars' => Inertia::defer(fn (): Collection => $action->handle($user)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('car/create');
    }

    public function store(CreateCarRequest $request, #[CurrentUser] User $user, CreateCar $action): RedirectResponse
    {
        $action->handle($user, $request->validated());

        return to_route('cars.index')->with('success', 'Car created successfully');
    }

    public function show(Car $car, ShowCar $action): Response
    {
        $data = $action->handle($car);

        return Inertia::render('car/show', [
            'car' => $data['car'],
            'expenses' => Inertia::defer($data['expenses']),
            'refuels' => Inertia::defer($data['refuels']),
            'start_milage' => $data['start_milage'],
        ]);
    }

    public function edit(#[CurrentUser] User $user, Car $car): Response
    {
        $carUsers = $car->users()->get(['users.id', 'users.name', 'users.email'])->map(fn (User $carUser): array => [
            'id' => $carUser->id,
            'name' => $carUser->name,
            'email' => $carUser->email,
            'role' => CarUser::of($carUser)->role,
        ]);

        return Inertia::render('car/edit', [
            'car' => $car,
            'carUsers' => $carUsers,
            'isOwner' => $user->can('manageUsers', $car),
        ]);
    }

    public function update(UpdateCarRequest $request, Car $car, UpdateCar $action): RedirectResponse
    {
        $action->handle($car, $request->validated());

        return to_route('cars.index')->with('success', 'Car updated successfully');
    }

    public function destroy(Car $car, DeleteCar $action): RedirectResponse
    {
        /**
         * A car's refuel and expense history is not disposable. Deleting is only
         * offered for cars that never got used; anything else must be kept.
         */
        if ($car->hasHistory()) {
            return back()->withErrors([
                'car' => 'This car has refuels or expenses recorded and cannot be deleted.',
            ]);
        }

        $action->handle($car);

        return back()->with('success', 'Car deleted successfully');
    }
}
