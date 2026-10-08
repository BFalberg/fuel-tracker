<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateGasStation;
use App\Actions\DeleteGasStation;
use App\Actions\ListGasStations;
use App\Actions\UpdateGasStation;
use App\Http\Requests\CreateGasStationRequest;
use App\Http\Requests\UpdateGasStationRequest;
use App\Models\GasStation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final readonly class GasStationController
{
    public function index(ListGasStations $action): Response
    {
        return Inertia::render('gas-station/index', [
            'gasStations' => Inertia::defer(fn (): Collection => $action->handle()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('gas-station/create');
    }

    public function store(CreateGasStationRequest $request, CreateGasStation $action): RedirectResponse
    {
        $action->handle($request->validated());

        return to_route('gas-stations.index')->with('success', 'Gas station created successfully');
    }

    public function edit(GasStation $gasStation): Response
    {
        return Inertia::render('gas-station/edit', [
            'gasStation' => $gasStation,
        ]);
    }

    public function update(UpdateGasStationRequest $request, GasStation $gasStation, UpdateGasStation $action): RedirectResponse
    {
        $action->handle($gasStation, $request->validated());

        return to_route('gas-stations.index')->with('success', 'Gas station updated successfully');
    }

    public function destroy(GasStation $gasStation, DeleteGasStation $action): RedirectResponse
    {
        $action->handle($gasStation);

        return back()->with('success', 'Gas station deleted successfully');
    }
}
