<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RefuelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $selectedCarId = request()->query('car_id');

        $refuels = Refuel::with(['car', 'gasStation'])
            ->when($selectedCarId, function ($query) use ($selectedCarId) {
                $query->where('car_id', $selectedCarId);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Refuels/Index', [
            'refuels' => $refuels,
            'cars' => Car::select(['id', 'name', 'is_electric'])->get(),
            'selectedCarId' => $selectedCarId,
            'gasStations' => GasStation::select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->orderByRaw('COUNT(refuels.id) DESC')
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Refuels/RefuelCreate', [
            'cars' => Car::select(['id', 'name', 'is_electric'])->get(),
            'gasStations' => GasStation::select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->orderByRaw('MAX(refuels.created_at) DESC')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'gas_station_id' => 'nullable|exists:gas_stations,id',
            'new_gas_station_name' => 'nullable|string|max:255',
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

        $car = Car::select(['id', 'is_electric'])->findOrFail($validated['car_id']);

        if (! empty($validated['new_gas_station_name'])) {
            $station = GasStation::create([
                'name' => $validated['new_gas_station_name'],
                'address' => 'Unknown',
            ]);

            $validated['gas_station_id'] = $station->id;
        }

        $validated['type'] = $car->is_electric ? 'charge' : 'fossil';

        unset($validated['new_gas_station_name']);

        Refuel::create($validated);

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
    public function edit(Refuel $refuel): Response
    {
        $refuelData = Refuel::with(['car', 'gasStation'])->findOrFail($refuel->id);

        return Inertia::render('Refuels/RefuelEdit', [
            'refuel' => $refuelData,
            'cars' => Car::select(['id', 'name', 'is_electric'])->get(),
            'gasStations' => GasStation::select(['id', 'name'])->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Refuel $refuel)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'gas_station_id' => 'nullable|exists:gas_stations,id',
            'new_gas_station_name' => 'nullable|string|max:255',
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

        $car = Car::select(['id', 'is_electric'])->findOrFail($validated['car_id']);

        if (! empty($validated['new_gas_station_name'])) {
            $station = GasStation::create([
                'name' => $validated['new_gas_station_name'],
                'address' => 'Unknown',
            ]);

            $validated['gas_station_id'] = $station->id;
        }

        $validated['type'] = $car->is_electric ? 'charge' : 'fossil';

        unset($validated['new_gas_station_name']);

        $refuel->update($validated);

        return redirect()->route('refuels.index')->with('success', 'Refuel updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Refuel $refuel)
    {
        $refuel->delete();

        return redirect()->back()->with('success', 'Refuel deleted successfully');
    }
}
