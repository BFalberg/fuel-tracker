<?php

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
use App\Rules\MileageFitsCarSeries;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RefuelController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ListRefuels $listRefuels, GetRefuelIndexData $getRefuelIndexData): Response
    {
        $validated = $request->validate([
            'car_id' => 'nullable|integer',
        ]);

        $selectedCarId = isset($validated['car_id']) ? (int) $validated['car_id'] : null;
        $user = $request->user();

        $indexData = null;
        $resolveIndexData = function () use (&$indexData, $getRefuelIndexData): array {
            return $indexData ??= $getRefuelIndexData->handle();
        };

        return Inertia::render('Refuels/Index', [
            'refuels' => Inertia::defer(fn () => $listRefuels->handle($user, $selectedCarId)),
            'cars' => Inertia::defer(fn () => $resolveIndexData()['cars']),
            'selectedCarId' => $selectedCarId,
            'gasStations' => Inertia::defer(fn () => $resolveIndexData()['gasStations']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(GetRefuelFormData $getRefuelFormData): Response
    {
        $formData = $getRefuelFormData->handle(true);

        return Inertia::render('Refuels/RefuelCreate', [
            'cars' => $formData['cars'],
            'gasStations' => $formData['gasStations'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, CreateRefuel $createRefuel)
    {
        $car = Car::findOrFail($request->input('car_id'));
        $this->authorize('view', $car);

        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'gas_station_id' => 'nullable|exists:gas_stations,id',
            'new_gas_station_name' => 'nullable|string|max:255',
            'new_gas_station_address' => 'nullable|string|max:255',
            'liters_refueled' => 'required|numeric|gt:0',
            'total_price' => 'required|numeric|min:0',
            'mileage' => ['required', 'integer', 'min:0', MileageFitsCarSeries::whenCreating($car)],
        ]);

        $createRefuel->handle($validated);

        return redirect()->route('refuels.index')->with('success', 'Refuel created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Refuel $refuel, GetRefuelFormData $getRefuelFormData, GetMileageBounds $getMileageBounds): Response
    {
        $this->authorize('update', $refuel);

        $refuelData = $refuel->load(['car', 'gasStation']);
        $formData = $getRefuelFormData->handle(false);

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
    public function update(Request $request, Refuel $refuel, UpdateRefuel $updateRefuel)
    {
        $this->authorize('update', $refuel);

        /**
         * `car_id` is deliberately absent: a refuel cannot be moved between cars,
         * because mileage is a per-car monotonic series and re-parenting would
         * retroactively corrupt the consumption history of both cars.
         */
        $validated = $request->validate([
            'gas_station_id' => 'nullable|exists:gas_stations,id',
            'new_gas_station_name' => 'nullable|string|max:255',
            'new_gas_station_address' => 'nullable|string|max:255',
            'liters_refueled' => 'required|numeric|gt:0',
            'total_price' => 'required|numeric|min:0',
            'mileage' => ['required', 'integer', 'min:0', MileageFitsCarSeries::whenUpdating($refuel)],
        ]);

        $updateRefuel->handle($refuel, $validated);

        return redirect()->route('refuels.index')->with('success', 'Refuel updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Refuel $refuel, DeleteRefuel $deleteRefuel)
    {
        $this->authorize('delete', $refuel);

        $deleteRefuel->handle($refuel);

        return redirect()->back()->with('success', 'Refuel deleted successfully');
    }
}
