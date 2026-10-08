<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateRefuel;
use App\Actions\DeleteRefuel;
use App\Actions\GetMileageBounds;
use App\Actions\GetRefuelFormData;
use App\Actions\GetRefuelIndexData;
use App\Actions\ListRefuels;
use App\Actions\UpdateRefuel;
use App\Http\Requests\CreateRefuelRequest;
use App\Http\Requests\ListRefuelsRequest;
use App\Http\Requests\UpdateRefuelRequest;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

final readonly class RefuelController
{
    public function index(ListRefuelsRequest $request, #[CurrentUser] User $user, ListRefuels $listRefuels, GetRefuelIndexData $getRefuelIndexData): Response
    {
        $selectedCarId = $request->selectedCarId();

        $indexData = null;
        $resolveIndexData = function () use (&$indexData, $getRefuelIndexData, $user): array {
            return $indexData ??= $getRefuelIndexData->handle($user);
        };

        return Inertia::render('refuel/index', [
            'refuels' => Inertia::defer(fn (): LengthAwarePaginator => $listRefuels->handle($user, $selectedCarId)),
            'cars' => Inertia::defer(fn (): Collection => $resolveIndexData()['cars']),
            'selectedCarId' => $selectedCarId,
            'gasStations' => Inertia::defer(fn (): Collection => $resolveIndexData()['gasStations']),
        ]);
    }

    public function create(#[CurrentUser] User $user, GetRefuelFormData $action): Response
    {
        $formData = $action->handle($user, true);

        return Inertia::render('refuel/create', [
            'cars' => $formData['cars'],
            'gasStations' => $formData['gasStations'],
        ]);
    }

    public function store(CreateRefuelRequest $request, CreateRefuel $action): RedirectResponse
    {
        $action->handle($request->car(), $request->validated());

        return to_route('refuels.index')->with('success', 'Refuel created successfully');
    }

    public function edit(#[CurrentUser] User $user, Refuel $refuel, GetRefuelFormData $getRefuelFormData, GetMileageBounds $getMileageBounds): Response
    {
        $formData = $getRefuelFormData->handle($user, false);

        return Inertia::render('refuel/edit', [
            'refuel' => $refuel->load(['car', 'gasStation']),
            'cars' => $formData['cars'],
            'gasStations' => $formData['gasStations'],
            'mileageBounds' => $getMileageBounds->handle($refuel),
        ]);
    }

    public function update(UpdateRefuelRequest $request, Refuel $refuel, UpdateRefuel $action): RedirectResponse
    {
        $action->handle($refuel, $request->validated());

        return to_route('refuels.index')->with('success', 'Refuel updated successfully');
    }

    public function destroy(Refuel $refuel, DeleteRefuel $action): RedirectResponse
    {
        $action->handle($refuel);

        return back()->with('success', 'Refuel deleted successfully');
    }
}
