<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Refuel\CreateRefuel;
use App\Actions\Refuel\DeleteRefuel;
use App\Actions\Refuel\GetMileageBounds;
use App\Actions\Refuel\GetRefuelFormData;
use App\Actions\Refuel\GetRefuelIndexData;
use App\Actions\Refuel\ListRefuels;
use App\Actions\Refuel\UpdateRefuel;
use App\Models\Car;
use App\Models\Refuel;
use App\Models\User;
use App\Rules\MileageFitsCarSeries;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

final class RefuelController
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, #[CurrentUser] User $user, ListRefuels $listRefuels, GetRefuelIndexData $getRefuelIndexData): Response
    {
        $request->validate([
            'car_id' => ['nullable', 'integer'],
        ]);

        $selectedCarId = $request->filled('car_id') ? $request->integer('car_id') : null;

        $indexData = null;
        $resolveIndexData = function () use (&$indexData, $getRefuelIndexData, $user): array {
            return $indexData ??= $getRefuelIndexData->handle($user);
        };

        return Inertia::render('Refuels/Index', [
            'refuels' => Inertia::defer(fn (): LengthAwarePaginator => $listRefuels->handle($user, $selectedCarId)),
            'cars' => Inertia::defer(fn (): Collection => $resolveIndexData()['cars']),
            'selectedCarId' => $selectedCarId,
            'gasStations' => Inertia::defer(fn (): Collection => $resolveIndexData()['gasStations']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(#[CurrentUser] User $user, GetRefuelFormData $getRefuelFormData): Response
    {
        $formData = $getRefuelFormData->handle($user, true);

        return Inertia::render('Refuels/RefuelCreate', [
            'cars' => $formData['cars'],
            'gasStations' => $formData['gasStations'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, CreateRefuel $createRefuel): RedirectResponse
    {
        $car = Car::query()->findOrFail($request->integer('car_id'));
        $this->authorize('view', $car);

        $request->validate([
            'car_id' => ['required', 'exists:cars,id'],
            'gas_station_id' => ['nullable', 'exists:gas_stations,id'],
            'new_gas_station_name' => ['nullable', 'string', 'max:255'],
            'new_gas_station_address' => ['nullable', 'string', 'max:255'],
            'liters_refueled' => ['required', 'numeric', 'gt:0'],
            'total_price' => ['required', 'numeric', 'min:0'],
            'mileage' => ['required', 'integer', 'min:0', MileageFitsCarSeries::whenCreating($car)],
        ]);

        $createRefuel->handle(['car_id' => $car->id, ...$this->refuelAttributes($request)]);

        return to_route('refuels.index')->with('success', 'Refuel created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(#[CurrentUser] User $user, Refuel $refuel, GetRefuelFormData $getRefuelFormData, GetMileageBounds $getMileageBounds): Response
    {
        $this->authorize('update', $refuel);

        $refuelData = $refuel->load(['car', 'gasStation']);
        $formData = $getRefuelFormData->handle($user, false);

        return Inertia::render('Refuels/RefuelEdit', [
            'refuel' => $refuelData,
            'cars' => $formData['cars'],
            'gasStations' => $formData['gasStations'],
            'mileageBounds' => $getMileageBounds->handle($refuel),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Refuel $refuel, UpdateRefuel $updateRefuel): RedirectResponse
    {
        $this->authorize('update', $refuel);

        /**
         * `car_id` is deliberately absent: a refuel cannot be moved between cars,
         * because mileage is a per-car monotonic series and re-parenting would
         * retroactively corrupt the consumption history of both cars.
         */
        $request->validate([
            'gas_station_id' => ['nullable', 'exists:gas_stations,id'],
            'new_gas_station_name' => ['nullable', 'string', 'max:255'],
            'new_gas_station_address' => ['nullable', 'string', 'max:255'],
            'liters_refueled' => ['required', 'numeric', 'gt:0'],
            'total_price' => ['required', 'numeric', 'min:0'],
            'mileage' => ['required', 'integer', 'min:0', MileageFitsCarSeries::whenUpdating($refuel)],
        ]);

        $updateRefuel->handle($refuel, $this->refuelAttributes($request));

        return to_route('refuels.index')->with('success', 'Refuel updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Refuel $refuel, DeleteRefuel $deleteRefuel): RedirectResponse
    {
        $this->authorize('delete', $refuel);

        $deleteRefuel->handle($refuel);

        return back()->with('success', 'Refuel deleted successfully');
    }

    /**
     * The validated refuel attributes, without the car. An optional field is only present
     * when the request sent it, so an update leaves an omitted field unchanged.
     *
     * @return array{gas_station_id?: int|null, new_gas_station_name?: string|null, new_gas_station_address?: string|null, liters_refueled: float, total_price: float, mileage: int}
     */
    private function refuelAttributes(Request $request): array
    {
        $attributes = [
            'liters_refueled' => $request->float('liters_refueled'),
            'total_price' => $request->float('total_price'),
            'mileage' => $request->integer('mileage'),
        ];

        if ($request->has('gas_station_id')) {
            $attributes['gas_station_id'] = $request->filled('gas_station_id') ? $request->integer('gas_station_id') : null;
        }

        foreach (['new_gas_station_name', 'new_gas_station_address'] as $optionalField) {
            if ($request->has($optionalField)) {
                $attributes[$optionalField] = $request->filled($optionalField) ? $request->string($optionalField)->value() : null;
            }
        }

        return $attributes;
    }
}
