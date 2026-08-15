<?php

namespace App\Http\Controllers;

use App\Actions\Cars\CreateCar;
use App\Actions\Cars\DeleteCar;
use App\Actions\Cars\ListCars;
use App\Actions\Cars\ShowCar;
use App\Actions\Cars\UpdateCar;
use App\Models\Car;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    use AuthorizesRequests;

    public function index(ListCars $listCars): Response
    {
        return Inertia::render('Cars/Index', [
            'cars' => Inertia::defer(fn () => $listCars->handle()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Cars/CarCreate');
    }

    public function store(Request $request, CreateCar $createCar)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars',
            'is_electric' => 'required|boolean',
            'start_milage' => 'nullable|integer|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
        ]);

        $createCar->handle(auth()->user(), $validated);

        return redirect()->route('cars.index')->with('success', 'Car created successfully');
    }

    public function show(Car $car, ShowCar $showCar): Response
    {
        $this->authorize('view', $car);

        $data = $showCar->handle($car);

        return Inertia::render('Cars/Show', [
            'car' => $data['car'],
            'expenses' => Inertia::defer($data['expenses']),
            'refuels' => Inertia::defer($data['refuels']),
            'start_milage' => $data['start_milage'],
        ]);
    }

    public function edit(Request $request, Car $car): Response
    {
        $this->authorize('update', $car);

        $carUsers = $car->users()->get(['users.id', 'users.name', 'users.email'])->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->pivot->role,
        ]);

        return Inertia::render('Cars/CarEdit', [
            'car' => $car,
            'carUsers' => $carUsers,
            'isOwner' => $request->user()->can('manageUsers', $car),
        ]);
    }

    public function update(Request $request, Car $car, UpdateCar $updateCar)
    {
        $this->authorize('update', $car);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars,registration_number,'.$car->id,
            'is_electric' => 'required|boolean',
            'start_milage' => 'nullable|integer|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
        ]);

        $updateCar->handle($car, $validated);

        return redirect()->route('cars.index')->with('success', 'Car updated successfully');
    }

    public function destroy(Car $car, DeleteCar $deleteCar)
    {
        $this->authorize('delete', $car);

        /**
         * A car's refuel and expense history is not disposable. Deleting is only
         * offered for cars that never got used; anything else must be kept.
         */
        if ($car->hasHistory()) {
            return redirect()->back()->withErrors([
                'car' => 'This car has refuels or expenses recorded and cannot be deleted.',
            ]);
        }

        $deleteCar->handle($car);

        return redirect()->back()->with('success', 'Car deleted successfully');
    }
}
