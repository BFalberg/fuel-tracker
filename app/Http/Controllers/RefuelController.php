<?php

namespace App\Http\Controllers;

use App\Models\Refuel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Car;
use App\Models\GasStation;
use Illuminate\Validation\Rule;

class RefuelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $latestGasStationId = Refuel::latest()->value('gas_station_id');

        $refuels = Refuel::with(['car', 'gasStation'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Refuels/Index', [
            'refuels' => $refuels,
            'cars' => Car::select(['id', 'name'])->get(),
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'gas_station_id' => 'required|exists:gas_stations,id',
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

        Refuel::create($validated);

        return redirect()->back()->with('success', 'Refuel created successfully');
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
    public function edit(Refuel $refuel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Refuel $refuel)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'gas_station_id' => 'required|exists:gas_stations,id',
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

        $refuel->update($validated);

        return redirect()->back()->with('success', 'Refuel updated successfully');
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
