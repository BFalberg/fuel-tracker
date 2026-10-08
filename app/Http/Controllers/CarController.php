<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Cars\CreateCar;
use App\Actions\Cars\DeleteCar;
use App\Actions\Cars\ListCars;
use App\Actions\Cars\ShowCar;
use App\Actions\Cars\UpdateCar;
use App\Models\Car;
use App\Models\CarUser;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

final class CarController extends Controller
{
    use AuthorizesRequests;

    public function index(#[CurrentUser] User $user, ListCars $listCars): Response
    {
        return Inertia::render('Cars/Index', [
            'cars' => Inertia::defer(fn (): Collection => $listCars->handle($user)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Cars/CarCreate');
    }

    public function store(Request $request, #[CurrentUser] User $user, CreateCar $createCar): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'registration_number' => ['required', 'string', 'max:255', 'unique:cars'],
            'is_electric' => ['required', 'boolean'],
            'start_milage' => ['nullable', 'integer', 'min:0'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $createCar->handle($user, $this->carAttributes($request));

        return to_route('cars.index')->with('success', 'Car created successfully');
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

    public function edit(#[CurrentUser] User $user, Car $car): Response
    {
        $this->authorize('update', $car);

        $carUsers = $car->users()->get(['users.id', 'users.name', 'users.email'])->map(fn (User $carUser): array => [
            'id' => $carUser->id,
            'name' => $carUser->name,
            'email' => $carUser->email,
            'role' => CarUser::of($carUser)->role,
        ]);

        return Inertia::render('Cars/CarEdit', [
            'car' => $car,
            'carUsers' => $carUsers,
            'isOwner' => $user->can('manageUsers', $car),
        ]);
    }

    public function update(Request $request, Car $car, UpdateCar $updateCar): RedirectResponse
    {
        $this->authorize('update', $car);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'registration_number' => 'required|string|max:255|unique:cars,registration_number,'.$car->id,
            'is_electric' => ['required', 'boolean'],
            'start_milage' => ['nullable', 'integer', 'min:0'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $updateCar->handle($car, $this->carAttributes($request));

        return to_route('cars.index')->with('success', 'Car updated successfully');
    }

    public function destroy(Car $car, DeleteCar $deleteCar): RedirectResponse
    {
        $this->authorize('delete', $car);

        /**
         * A car's refuel and expense history is not disposable. Deleting is only
         * offered for cars that never got used; anything else must be kept.
         */
        if ($car->hasHistory()) {
            return back()->withErrors([
                'car' => 'This car has refuels or expenses recorded and cannot be deleted.',
            ]);
        }

        $deleteCar->handle($car);

        return back()->with('success', 'Car deleted successfully');
    }

    /**
     * The validated car attributes. An optional field is only present when the request sent it,
     * so an update leaves an omitted field unchanged.
     *
     * @return array{name: string, registration_number: string, is_electric: bool, start_milage?: int|null, purchase_price?: float|null, sale_price?: float|null}
     */
    private function carAttributes(Request $request): array
    {
        $attributes = [
            'name' => $request->string('name')->value(),
            'registration_number' => $request->string('registration_number')->value(),
            'is_electric' => $request->boolean('is_electric'),
        ];

        if ($request->has('start_milage')) {
            $attributes['start_milage'] = $request->filled('start_milage') ? $request->integer('start_milage') : null;
        }

        if ($request->has('purchase_price')) {
            $attributes['purchase_price'] = $request->filled('purchase_price') ? $request->float('purchase_price') : null;
        }

        if ($request->has('sale_price')) {
            $attributes['sale_price'] = $request->filled('sale_price') ? $request->float('sale_price') : null;
        }

        return $attributes;
    }
}
