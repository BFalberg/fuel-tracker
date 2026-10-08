<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\GasStations\CreateGasStation;
use App\Actions\GasStations\DeleteGasStation;
use App\Actions\GasStations\ListGasStations;
use App\Actions\GasStations\UpdateGasStation;
use App\Models\GasStation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class GasStationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ListGasStations $listGasStations): Response
    {
        return Inertia::render('GasStations/Index', [
            'gasStations' => Inertia::defer(fn (): Collection => $listGasStations->handle()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('GasStations/GasStationCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, CreateGasStation $createGasStation): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
        ]);

        $createGasStation->handle($this->gasStationAttributes($request));

        return to_route('gas-stations.index')->with('success', 'Gas station created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GasStation $gasStation): Response
    {
        return Inertia::render('GasStations/GasStationEdit', [
            'gasStation' => $gasStation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GasStation $gasStation, UpdateGasStation $updateGasStation): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
        ]);

        $updateGasStation->handle($gasStation, $this->gasStationAttributes($request));

        return to_route('gas-stations.index')->with('success', 'Gas station updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GasStation $gasStation, DeleteGasStation $deleteGasStation): RedirectResponse
    {
        $deleteGasStation->handle($gasStation);

        return back()->with('success', 'Gas station deleted successfully');
    }

    /**
     * @return array{name: string, address: string}
     */
    private function gasStationAttributes(Request $request): array
    {
        return [
            'name' => $request->string('name')->value(),
            'address' => $request->string('address')->value(),
        ];
    }
}
