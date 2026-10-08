<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;

/**
 * Refuels are created directly rather than through the controller so a series
 * can be seeded in any order, including states the create rule would reject.
 *
 * @param  array<string, mixed>  $attributes
 */
function seedRefuel(Car $car, GasStation $station, int $mileage, array $attributes = []): Refuel
{
    return Refuel::query()->create([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => $mileage,
        'type' => 'fossil',
        ...$attributes,
    ]);
}

/**
 * A car with three refuels at 1000, 2000 and 3000 km.
 *
 * @return array{0: User, 1: Car, 2: GasStation, 3: Refuel, 4: Refuel, 5: Refuel}
 */
function seedRefuelSeries(): array
{
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    return [
        $user,
        $car,
        $station,
        seedRefuel($car, $station, 1000),
        seedRefuel($car, $station, 2000),
        seedRefuel($car, $station, 3000),
    ];
}

/**
 * @param  array<string, mixed>  $overrides
 */
function putRefuel(User $user, Refuel $refuel, array $overrides = []): TestResponse
{
    return test()->actingAs($user)
        ->put(route('refuels.update', $refuel), [
            'gas_station_id' => $refuel->gas_station_id,
            'liters_refueled' => $refuel->liters_refueled,
            'total_price' => $refuel->total_price,
            'mileage' => $refuel->mileage,
            ...$overrides,
        ]);
}

it('defers the refuels of the users cars on the index page', function (): void {
    $user = User::factory()->create();
    $ownCar = Car::factory()->ownedBy($user)->create();
    Refuel::factory()->forCar($ownCar)->create();
    Refuel::factory()->forCar(Car::factory()->ownedBy(User::factory()->create())->create())->create();

    $this->actingAs($user)
        ->get(route('refuels.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('refuel/index')
            ->where('selectedCarId', null)
            ->missing('refuels')
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('refuels.data', 1)
                ->where('refuels.data.0.car_id', $ownCar->id)
                ->has('cars', 1)
                ->has('gasStations', 2)));
});

it('filters the refuels by car', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $otherCar = Car::factory()->ownedBy($user)->create();
    Refuel::factory()->forCar($car)->create();
    Refuel::factory()->forCar($otherCar)->create();

    $this->actingAs($user)
        ->get(route('refuels.index', ['car_id' => $car->id]))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedCarId', $car->id)
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('refuels.data', 1)
                ->where('refuels.data.0.car_id', $car->id)));
});

it('returns nothing when filtering by the car of another user', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();
    $strangerCar = Car::factory()->ownedBy(User::factory()->create())->create();
    Refuel::factory()->forCar($strangerCar)->create();

    $this->actingAs($user)
        ->get(route('refuels.index', ['car_id' => $strangerCar->id]))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('refuels.data', 0)));
});

it('renders the create refuel page', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();
    GasStation::factory()->create();

    $this->actingAs($user)
        ->get(route('refuels.create'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('refuel/create')
            ->has('cars', 1)
            ->has('gasStations', 1));
});

it('stores the refuel type from the car type', function (bool $isElectric, string $type): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => $isElectric]);

    $this->actingAs($user)
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'gas_station_id' => GasStation::factory()->create()->id,
            'liters_refueled' => 12.5,
            'total_price' => 250,
            'mileage' => 1000,
        ])
        ->assertRedirectToRoute('refuels.index')
        ->assertSessionHas('success', 'Refuel created successfully');

    expect(Refuel::query()->sole()->type)->toBe($type);
})->with([
    'electric' => [true, 'charge'],
    'fossil' => [false, 'fossil'],
]);

it('creates a new gas station during refuel creation', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $this->actingAs($user)
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'gas_station_id' => null,
            'new_gas_station_name' => 'Fast Charge One',
            'new_gas_station_address' => '123 Main St',
            'liters_refueled' => 15,
            'total_price' => 300,
            'mileage' => 1200,
        ])
        ->assertRedirectToRoute('refuels.index');

    $station = GasStation::query()->where('name', 'Fast Charge One')->sole();

    expect(Refuel::query()->sole()->gas_station_id)->toBe($station->id)
        ->and($station->address)->toBe('123 Main St');
});

it('lets a co-driver add a refuel to a shared car', function (): void {
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy(User::factory()->create())->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'liters_refueled' => 40,
            'total_price' => 0,
            'mileage' => 1000,
        ])
        ->assertRedirectToRoute('refuels.index');

    expect(Refuel::query()->where('car_id', $car->id)->count())->toBe(1);
});

it('does not let a stranger add a refuel', function (): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'liters_refueled' => 40,
            'total_price' => 0,
            'mileage' => 1000,
        ])
        ->assertForbidden();

    expect(Refuel::query()->count())->toBe(0);
});

it('returns 404 for a refuel on an unknown car', function (): void {
    $this->actingAs(User::factory()->create())
        ->post(route('refuels.store'), [
            'car_id' => 99999,
            'liters_refueled' => 40,
            'total_price' => 0,
            'mileage' => 1000,
        ])
        ->assertNotFound();
});

it('requires the mileage to exceed the highest existing mileage', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();
    seedRefuel($car, $station, 1000, ['created_at' => now()->subDays(2)]);
    seedRefuel($car, $station, 1500, ['created_at' => now()->subDay()]);

    $this->actingAs($user)
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'gas_station_id' => $station->id,
            'liters_refueled' => 10,
            'total_price' => 200,
            'mileage' => 1200,
        ])
        ->assertSessionHasErrors(['mileage' => "The mileage must be greater than the last refuel's mileage (1500)."]);
});

it('accepts a mileage above the highest existing mileage', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();
    seedRefuel($car, $station, 1000);

    $this->actingAs($user)
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'gas_station_id' => $station->id,
            'liters_refueled' => 10,
            'total_price' => 200,
            'mileage' => 1500,
        ])
        ->assertRedirectToRoute('refuels.index');
});

it('renders the edit refuel page with the mileage bounds', function (): void {
    [$user, , , , $middle] = seedRefuelSeries();

    $this->actingAs($user)
        ->get(route('refuels.edit', $middle))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('refuel/edit')
            ->where('refuel.id', $middle->id)
            ->where('mileageBounds', ['min' => 1000, 'max' => 3000])
            ->has('cars', 1)
            ->has('gasStations', 1));
});

it('lets a co-driver edit and update a refuel on a shared car', function (): void {
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy(User::factory()->create())->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);
    $refuel = Refuel::factory()->forCar($car)->create(['mileage' => 1000]);

    $this->actingAs($coDriver)
        ->get(route('refuels.edit', $refuel))
        ->assertOk();

    putRefuel($coDriver, $refuel, ['mileage' => 5000])
        ->assertRedirectToRoute('refuels.index')
        ->assertSessionHas('success', 'Refuel updated successfully');

    expect($refuel->fresh()?->mileage)->toBe(5000);
});

it('creates a new gas station during a refuel update', function (): void {
    [$user, , , , $middle] = seedRefuelSeries();

    putRefuel($user, $middle, ['new_gas_station_name' => 'New Station'])
        ->assertRedirectToRoute('refuels.index');

    $station = GasStation::query()->where('name', 'New Station')->sole();

    expect($middle->fresh()?->gas_station_id)->toBe($station->id)
        ->and($station->address)->toBe('Unknown');
});

it('does not let a stranger edit, update or delete a refuel', function (string $method, string $route): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create();
    $refuel = Refuel::factory()->forCar($car)->create(['mileage' => 1000]);

    $this->actingAs(User::factory()->create())
        ->{$method}(route($route, $refuel), [
            'liters_refueled' => 40,
            'total_price' => 500,
            'mileage' => 5000,
        ])
        ->assertForbidden();

    expect($refuel->fresh()?->mileage)->toBe(1000);
})->with([
    'edit' => ['get', 'refuels.edit'],
    'update' => ['put', 'refuels.update'],
    'delete' => ['delete', 'refuels.destroy'],
]);

it('never moves a refuel to another car', function (): void {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();
    $refuel = Refuel::factory()->forCar($carA)->create(['mileage' => 1000]);

    putRefuel($user, $refuel, ['car_id' => $carB->id, 'mileage' => 5000]);

    expect($refuel->fresh()?->car_id)->toBe($carA->id);
});

it('lets an older refuel be edited without touching its mileage', function (): void {
    [$user, , , , $middle] = seedRefuelSeries();

    putRefuel($user, $middle, ['liters_refueled' => 42.5, 'total_price' => 777])
        ->assertRedirectToRoute('refuels.index');

    $middle->refresh();

    expect($middle->mileage)->toBe(2000)
        ->and($middle->liters_refueled)->toBe('42.50')
        ->and($middle->total_price)->toBe('777.00');
});

it('lets a refuel move within the gap left by its neighbours', function (): void {
    [$user, , , , $middle] = seedRefuelSeries();

    putRefuel($user, $middle, ['mileage' => 1500])->assertRedirectToRoute('refuels.index');

    expect($middle->fresh()?->mileage)->toBe(1500);
});

it('does not let a refuel move onto or past a neighbour', function (int $mileage): void {
    [$user, , , , $middle] = seedRefuelSeries();

    putRefuel($user, $middle, ['mileage' => $mileage])->assertSessionHasErrors('mileage');

    expect($middle->fresh()?->mileage)->toBe(2000);
})->with([
    'equal to the previous refuel' => 1000,
    'below the previous refuel' => 500,
    'equal to the next refuel' => 3000,
    'above the next refuel' => 4000,
]);

it('bounds the oldest refuel only from above', function (): void {
    [$user, , , $oldest] = seedRefuelSeries();

    putRefuel($user, $oldest, ['mileage' => 1])->assertRedirectToRoute('refuels.index');
    expect($oldest->fresh()?->mileage)->toBe(1);

    putRefuel($user, $oldest->refresh(), ['mileage' => 2000])
        ->assertSessionHasErrors(['mileage' => "The mileage must be lower than the next refuel's mileage (2000)."]);
});

it('bounds the newest refuel only from below', function (): void {
    [$user, , , , , $newest] = seedRefuelSeries();

    putRefuel($user, $newest, ['mileage' => 2000])
        ->assertSessionHasErrors(['mileage' => "The mileage must be greater than the previous refuel's mileage (2000)."]);

    putRefuel($user, $newest, ['mileage' => 99999])->assertRedirectToRoute('refuels.index');

    expect($newest->fresh()?->mileage)->toBe(99999);
});

it('gives a car with a single refuel no mileage bounds', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $only = seedRefuel($car, GasStation::factory()->create(), 50000);

    putRefuel($user, $only, ['mileage' => 10])->assertRedirectToRoute('refuels.index');

    expect($only->fresh()?->mileage)->toBe(10);
});

it('keeps a refuel tied with a sibling editable', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();
    seedRefuel($car, $station, 2000);
    $tied = seedRefuel($car, $station, 2000);

    putRefuel($user, $tied, ['total_price' => 350])->assertRedirectToRoute('refuels.index');

    expect($tied->fresh()?->total_price)->toBe('350.00');
});

it('scopes the mileage bounds to the car of the refuel', function (): void {
    [$user, , , , $middle] = seedRefuelSeries();
    $otherCar = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    seedRefuel($otherCar, GasStation::factory()->create(), 1500);

    putRefuel($user, $middle, ['mileage' => 1500])->assertRedirectToRoute('refuels.index');

    expect($middle->fresh()?->mileage)->toBe(1500);
});

it('lets a co-driver delete a refuel on a shared car', function (): void {
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy(User::factory()->create())->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);
    $refuel = Refuel::factory()->forCar($car)->create();

    $this->actingAs($coDriver)
        ->delete(route('refuels.destroy', $refuel))
        ->assertRedirect()
        ->assertSessionHas('success', 'Refuel deleted successfully');

    expect(Refuel::query()->find($refuel->id))->toBeNull();
});
