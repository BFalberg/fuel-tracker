<?php

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;

uses(RefreshDatabase::class);

/**
 * Refuels are created directly rather than through the controller so a series
 * can be seeded in any order, including states the create rule would reject.
 */
function seedRefuel(Car $car, GasStation $station, int $mileage, array $attributes = []): Refuel
{
    return Refuel::create(array_merge([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => $mileage,
        'type' => 'fossil',
    ], $attributes));
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

function putRefuel(User $user, Refuel $refuel, array $overrides = []): TestResponse
{
    return test()->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->put("/refuels/{$refuel->id}", array_merge([
            '_token' => 'test',
            'gas_station_id' => $refuel->gas_station_id,
            'liters_refueled' => $refuel->liters_refueled,
            'total_price' => $refuel->total_price,
            'mileage' => $refuel->mileage,
        ], $overrides));
}

test('mileage must exceed the highest existing mileage, not just the most recent by date', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    // First refuel at 1000 km, created first
    seedRefuel($car, $station, 1000, ['created_at' => now()->subDays(2)]);

    // Second refuel at 1500 km, inserted later
    seedRefuel($car, $station, 1500, ['created_at' => now()->subDay()]);

    // 1200 should fail — 1500 is the highest mileage even if 1000 was oldest
    $this->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->post('/refuels', [
            '_token' => 'test',
            'car_id' => $car->id,
            'gas_station_id' => $station->id,
            'liters_refueled' => 10,
            'total_price' => 200,
            'mileage' => 1200,
        ])
        ->assertSessionHasErrors('mileage');
});

test('new refuel above highest existing mileage passes', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    seedRefuel($car, $station, 1000);

    $this->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->post('/refuels', [
            '_token' => 'test',
            'car_id' => $car->id,
            'gas_station_id' => $station->id,
            'liters_refueled' => 10,
            'total_price' => 200,
            'mileage' => 1500,
        ])
        ->assertRedirect('/refuels');
});

test('an older refuel can be edited without touching its mileage', function () {
    [$user, , , , $middle] = seedRefuelSeries();

    putRefuel($user, $middle, ['liters_refueled' => 42.5, 'total_price' => 777])
        ->assertRedirect('/refuels');

    $middle->refresh();

    expect($middle->mileage)->toBe(2000)
        ->and((float) $middle->liters_refueled)->toBe(42.5)
        ->and((float) $middle->total_price)->toBe(777.0);
});

test('a refuel can be moved within the gap left by its neighbours', function () {
    [$user, , , , $middle] = seedRefuelSeries();

    putRefuel($user, $middle, ['mileage' => 1500])->assertRedirect('/refuels');

    expect($middle->fresh()->mileage)->toBe(1500);
});

test('a refuel cannot be moved onto or past a neighbour', function (int $mileage) {
    [$user, , , , $middle] = seedRefuelSeries();

    putRefuel($user, $middle, ['mileage' => $mileage])->assertSessionHasErrors('mileage');

    expect($middle->fresh()->mileage)->toBe(2000);
})->with([
    'equal to the previous refuel' => 1000,
    'below the previous refuel' => 500,
    'equal to the next refuel' => 3000,
    'above the next refuel' => 4000,
]);

test('the oldest refuel is only bounded from above', function () {
    [$user, , , $oldest] = seedRefuelSeries();

    putRefuel($user, $oldest, ['mileage' => 1])->assertRedirect('/refuels');

    expect($oldest->fresh()->mileage)->toBe(1);
});

test('the oldest refuel cannot be moved onto the refuel after it', function () {
    [$user, , , $oldest] = seedRefuelSeries();

    putRefuel($user, $oldest, ['mileage' => 2000])->assertSessionHasErrors('mileage');

    expect($oldest->fresh()->mileage)->toBe(1000);
});

test('the newest refuel is only bounded from below', function () {
    [$user, , , , , $newest] = seedRefuelSeries();

    putRefuel($user, $newest, ['mileage' => 99999])->assertRedirect('/refuels');

    expect($newest->fresh()->mileage)->toBe(99999);
});

test('the newest refuel cannot be moved onto the refuel before it', function () {
    [$user, , , , , $newest] = seedRefuelSeries();

    putRefuel($user, $newest, ['mileage' => 2000])->assertSessionHasErrors('mileage');

    expect($newest->fresh()->mileage)->toBe(3000);
});

test('a car with a single refuel has no mileage bounds', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    $only = seedRefuel($car, $station, 50000);

    putRefuel($user, $only, ['mileage' => 10])->assertRedirect('/refuels');

    expect($only->fresh()->mileage)->toBe(10);
});

test('a refuel tied with a sibling stays editable', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    seedRefuel($car, $station, 2000);
    $tied = seedRefuel($car, $station, 2000);

    putRefuel($user, $tied, ['total_price' => 350])->assertRedirect('/refuels');

    expect((float) $tied->fresh()->total_price)->toBe(350.0);
});

test('mileage bounds are scoped to the refuels own car', function () {
    [$user, , , , $middle] = seedRefuelSeries();

    $otherCar = Car::factory()->ownedBy($user)->create(['is_electric' => false]);
    seedRefuel($otherCar, GasStation::factory()->create(), 1500);

    putRefuel($user, $middle, ['mileage' => 1500])->assertRedirect('/refuels');

    expect($middle->fresh()->mileage)->toBe(1500);
});
