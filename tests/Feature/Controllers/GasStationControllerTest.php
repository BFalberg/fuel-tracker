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

    $this->actingAs($user)
        ->delete(route('gas-stations.destroy', $station))
        ->assertRedirect()
        ->assertSessionHas('success', 'Gas station deleted successfully');

    expect(GasStation::query()->find($station->id))->toBeNull()
        ->and(Refuel::query()->whereIn('id', $refuels->pluck('id'))->whereNull('gas_station_id')->count())->toBe(3);
});

it("forbids changing a station another user's car depends on", function (string $method, string $route): void {
    $user = User::factory()->create();
    $station = GasStation::factory()->create(['name' => 'Clever Viby']);
    Refuel::factory()->forCar(Car::factory()->ownedBy(User::factory()->create())->create())->atStation($station)->create();

    $this->actingAs($user)
        ->{$method}(route($route, $station), ['name' => 'Hijacked', 'address' => 'Nowhere'])
        ->assertForbidden();

    expect($station->fresh()?->name)->toBe('Clever Viby');
})->with([
    'edit' => ['get', 'gas-stations.edit'],
    'update' => ['put', 'gas-stations.update'],
    'delete' => ['delete', 'gas-stations.destroy'],
]);

it('marks which stations the user may manage', function (): void {
    $user = User::factory()->create();
    $own = GasStation::factory()->create(['created_at' => now()->subDay()]);
    Refuel::factory()->forCar(Car::factory()->ownedBy($user)->create())->atStation($own)->create();
    $shared = GasStation::factory()->create();
    Refuel::factory()->forCar(Car::factory()->ownedBy(User::factory()->create())->create())->atStation($shared)->create();

    $this->actingAs($user)
        ->get(route('gas-stations.index'))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->where('gasStations.0.id', $shared->id)
                ->where('gasStations.0.can_manage', false)
                ->where('gasStations.1.id', $own->id)
                ->where('gasStations.1.can_manage', true)));
});

it("may correct a station's position", function (): void {
    $station = GasStation::factory()->create(['latitude' => 55.0, 'longitude' => 9.0]);

    $this->actingAs(User::factory()->create())
        ->put(route('gas-stations.update', $station), [
            'name' => $station->name,
            'address' => $station->address,
            'latitude' => 56.1296,
            'longitude' => 10.1626,
        ])
        ->assertRedirectToRoute('gas-stations.index');

    expect($station->refresh()->only('latitude', 'longitude'))
        ->toBe(['latitude' => '56.1296000', 'longitude' => '10.1626000']);
});

it("may clear a station's position", function (): void {
    $station = GasStation::factory()->create(['latitude' => 55.0, 'longitude' => 9.0]);

    $this->actingAs(User::factory()->create())
        ->put(route('gas-stations.update', $station), [
            'name' => $station->name,
            'address' => $station->address,
            'latitude' => null,
            'longitude' => null,
        ]);

    expect($station->refresh()->latitude)->toBeNull()
        ->and($station->longitude)->toBeNull();
});

it('keeps the position when an update leaves it out', function (): void {
    $station = GasStation::factory()->create(['latitude' => 55.0, 'longitude' => 9.0]);

    $this->actingAs(User::factory()->create())
        ->put(route('gas-stations.update', $station), ['name' => 'Renamed', 'address' => 'Somewhere 1']);

    expect($station->refresh()->latitude)->toBe('55.0000000');
});

it('rejects a position outside the globe or with one coordinate', function (array $position, string $error): void {
    $this->actingAs(User::factory()->create())
        ->post(route('gas-stations.store'), ['name' => 'X', 'address' => 'Y', ...$position])
        ->assertSessionHasErrors($error);
})->with([
    'latitude out of range' => [['latitude' => 91, 'longitude' => 10], 'latitude'],
    'longitude missing' => [['latitude' => 56.1], 'longitude'],
]);

it('may create a station at a position', function (): void {
    $this->actingAs(User::factory()->create())
        ->post(route('gas-stations.store'), ['name' => 'Clever Home', 'address' => 'Home 1', 'latitude' => 56.1, 'longitude' => 10.2]);

    expect(GasStation::query()->sole()->latitude)->toBe('56.1000000');
});
