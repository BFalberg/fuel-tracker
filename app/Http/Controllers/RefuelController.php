<?php

namespace App\Http\Controllers;

use App\Actions\Refuel\CreateRefuel;
use App\Actions\Refuel\DeleteRefuel;
use App\Actions\Refuel\GetRefuelFormData;
use App\Actions\Refuel\GetRefuelIndexData;
use App\Actions\Refuel\ListRefuels;
use App\Actions\Refuel\UpdateRefuel;
use App\Models\Refuel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RefuelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ListRefuels $listRefuels, GetRefuelIndexData $getRefuelIndexData): Response
    {
        $selectedCarId = request()->query('car_id');

        $refuels = $listRefuels->handle($selectedCarId ? (int) $selectedCarId : null);
        $indexData = $getRefuelIndexData->handle();

        return Inertia::render('Refuels/Index', [
            'refuels' => Inertia::defer(fn () => $refuels),
            'cars' => Inertia::defer(fn () => $indexData['cars']),
            'selectedCarId' => $selectedCarId,
            'gasStations' => Inertia::defer(fn () => $indexData['gasStations']),
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
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'gas_station_id' => 'nullable|exists:gas_stations,id',
            'new_gas_station_name' => 'nullable|string|max:255',
            'new_gas_station_address' => 'nullable|string|max:255',
            'liters_refueled' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'mileage' => [
                'required',
                'integer',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    $lastRefuel = Refuel::where('car_id', $request->car_id)
                        ->latest()
                        ->first();

                    if ($lastRefuel && $value <= $lastRefuel->mileage) {
                        $fail("The mileage must be greater than the last refuel's mileage ({$lastRefuel->mileage}).");
                    }
                },
            ],
        ]);

        $createRefuel->handle($validated);

        return redirect()->route('refuels.index')->with('success', 'Refuel created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Refuel $refuel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Refuel $refuel, GetRefuelFormData $getRefuelFormData): Response
    {
        $refuelData = Refuel::with(['car', 'gasStation'])->findOrFail($refuel->id);
        $formData = $getRefuelFormData->handle(false);

        return Inertia::render('Refuels/RefuelEdit', [
            'refuel' => $refuelData,
            'cars' => $formData['cars'],
            'gasStations' => $formData['gasStations'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Refuel $refuel, UpdateRefuel $updateRefuel)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'gas_station_id' => 'nullable|exists:gas_stations,id',
            'new_gas_station_name' => 'nullable|string|max:255',
            'new_gas_station_address' => 'nullable|string|max:255',
            'liters_refueled' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'mileage' => [
                'required',
                'integer',
                'min:0',
                function ($attribute, $value, $fail) use ($request, $refuel) {
                    $lastRefuel = Refuel::where('car_id', $request->car_id)
                        ->where('id', '!=', $refuel->id)
                        ->latest()
                        ->first();

                    if ($lastRefuel && $value <= $lastRefuel->mileage) {
                        $fail("The mileage must be greater than the last refuel's mileage ({$lastRefuel->mileage}).");
                    }
                },
            ],
        ]);

        $updateRefuel->handle($refuel, $validated);

        return redirect()->route('refuels.index')->with('success', 'Refuel updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Refuel $refuel, DeleteRefuel $deleteRefuel)
    {
        $deleteRefuel->handle($refuel);

        return redirect()->back()->with('success', 'Refuel deleted successfully');
    }
}
