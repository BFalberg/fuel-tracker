<?php

namespace App\Http\Controllers;

use App\Models\GasStation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GasStationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('GasStations/Index', [
            'gasStations' => Inertia::defer(fn () => GasStation::latest()->get()),
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        GasStation::create($validated);

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
    public function update(Request $request, GasStation $gasStation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        $gasStation->update($validated);

        return redirect()->route('gas-stations.index')->with('success', 'Gas station updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GasStation $gasStation)
    {
        $gasStation->delete();

        return redirect()->back()->with('success', 'Gas station deleted successfully');
    }
}
