<?php

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('stores refuel type based on car type', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => true]);
    $station = GasStation::factory()->create();

    $payload = [
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 12.5,
        'total_price' => 250,
        'mileage' => 1000,
    ];

    $this->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->post('/refuels', [...$payload, '_token' => 'test'])
        ->assertRedirect('/refuels');

    $refuel = Refuel::firstOrFail();
    expect($refuel->type)->toBe('charge');
});

test('creates a new station when provided during refuel creation', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    $payload = [
        'car_id' => $car->id,
        'gas_station_id' => null,
        'new_gas_station_name' => 'Fast Charge One',
        'new_gas_station_address' => '123 Main St',
        'liters_refueled' => 15,
        'total_price' => 300,
        'mileage' => 1200,
    ];

    $this->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->post('/refuels', [...$payload, '_token' => 'test'])
        ->assertRedirect('/refuels');

    $station = GasStation::where('name', 'Fast Charge One')->firstOrFail();
    $refuel = Refuel::firstOrFail();

    expect($refuel->gas_station_id)->toBe($station->id)
        ->and($station->address)->toBe('123 Main St');
});

test('refuels list can be filtered by car', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $otherCar = Car::factory()->ownedBy($user)->create();
    $station = GasStation::factory()->create();

    Refuel::create([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => 1000,
        'type' => 'fossil',
    ]);

    Refuel::create([
        'car_id' => $otherCar->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 20,
        'total_price' => 400,
        'mileage' => 2000,
        'type' => 'fossil',
    ]);

    $response = $this->actingAs($user)->get('/refuels?car_id='.$car->id);

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Refuels/Index')
        ->where('selectedCarId', $car->id)
        ->missing('refuels')
        ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
            ->has('refuels.data', 1)
            ->where('refuels.data.0.car_id', $car->id)
        )
    );
});

test('co-driver can add a refuel to a shared car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'liters_refueled' => 40,
            'total_price' => 0,
            'mileage' => 1000,
        ])
        ->assertRedirect(route('refuels.index'));
});

test('stranger cannot add a refuel to a car they have no access to', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($stranger)
        ->post(route('refuels.store'), [
            'car_id' => $car->id,
            'liters_refueled' => 40,
            'total_price' => 0,
            'mileage' => 1000,
        ])
        ->assertForbidden();
});
