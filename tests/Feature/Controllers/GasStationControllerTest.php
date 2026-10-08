<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('defers the gas stations list with refuel counts', function (): void {
    $station = GasStation::factory()->create();
    Refuel::factory()->atStation($station)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('gas-stations.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('gas-station/index')
            ->missing('gasStations')
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('gasStations', 1)
                ->where('gasStations.0.refuels_count', 1)));
});

it('renders the create gas station page', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('gas-stations.create'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('gas-station/create'));
});

it('may create a gas station', function (): void {
    $this->actingAs(User::factory()->create())
        ->post(route('gas-stations.store'), ['name' => 'Circle K Nørreport', 'address' => 'Nørre Voldgade 1'])
        ->assertRedirectToRoute('gas-stations.index')
        ->assertSessionHas('success', 'Gas station created successfully');

    expect(GasStation::query()->sole()->only('name', 'address'))
        ->toBe(['name' => 'Circle K Nørreport', 'address' => 'Nørre Voldgade 1']);
});

it('does not let guests create a gas station', function (): void {
    $this->post(route('gas-stations.store'), ['name' => 'Circle K', 'address' => 'Somewhere'])
        ->assertRedirectToRoute('login');

    expect(GasStation::query()->count())->toBe(0);
});

it('renders the edit gas station page', function (): void {
    $station = GasStation::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('gas-stations.edit', $station))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('gas-station/edit')
            ->where('gasStation.id', $station->id));
});

it('may update a gas station', function (): void {
    $station = GasStation::factory()->create();

    $this->actingAs(User::factory()->create())
        ->put(route('gas-stations.update', $station), ['name' => 'Q8 Valby', 'address' => 'Valby Langgade 2'])
        ->assertRedirectToRoute('gas-stations.index')
        ->assertSessionHas('success', 'Gas station updated successfully');

    expect($station->refresh()->only('name', 'address'))
        ->toBe(['name' => 'Q8 Valby', 'address' => 'Valby Langgade 2']);
});

it('requires a name and an address', function (string $method, Closure $url): void {
    $this->actingAs(User::factory()->create())
        ->{$method}($url(), ['name' => '', 'address' => str_repeat('a', 256)])
        ->assertSessionHasErrors(['name', 'address']);
})->with([
    'create' => ['post', fn (): string => route('gas-stations.store')],
    'update' => ['put', fn (): string => route('gas-stations.update', GasStation::factory()->create())],
]);

it('never deletes the refuels of a deleted gas station', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $station = GasStation::factory()->create();
    $refuels = Refuel::factory()->count(3)->forCar($car)->atStation($station)->create();

    $otherCar = Car::factory()->ownedBy(User::factory()->create())->create();
    $otherRefuel = Refuel::factory()->forCar($otherCar)->atStation($station)->create();

    $this->actingAs($user)
        ->delete(route('gas-stations.destroy', $station))
        ->assertRedirect()
        ->assertSessionHas('success', 'Gas station deleted successfully');

    expect(GasStation::query()->find($station->id))->toBeNull()
        ->and(Refuel::query()->whereIn('id', $refuels->pluck('id'))->whereNull('gas_station_id')->count())->toBe(3)
        ->and($otherRefuel->fresh()?->gas_station_id)->toBeNull();
});
