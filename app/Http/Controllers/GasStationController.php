<?php

namespace App\Http\Controllers;

use App\Actions\GasStations\CreateGasStation;
use App\Actions\GasStations\DeleteGasStation;
use App\Actions\GasStations\ListGasStations;
use App\Actions\GasStations\UpdateGasStation;
use App\Models\GasStation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GasStationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ListGasStations $listGasStations)
    {
        return Inertia::render('GasStations/Index', [
            'gasStations' => Inertia::defer(fn () => $listGasStations->handle()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('GasStations/GasStationCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, CreateGasStation $createGasStation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        $createGasStation->handle($validated);

        return redirect()->route('gas-stations.index')->with('success', 'Gas station created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(GasStation $gasStation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GasStation $gasStation)
    {
        return Inertia::render('GasStations/GasStationEdit', [
            'gasStation' => $gasStation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GasStation $gasStation, UpdateGasStation $updateGasStation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        $updateGasStation->handle($gasStation, $validated);

        return redirect()->route('gas-stations.index')->with('success', 'Gas station updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GasStation $gasStation, DeleteGasStation $deleteGasStation)
    {
        $deleteGasStation->handle($gasStation);

        return redirect()->back()->with('success', 'Gas station deleted successfully');
    }
}
