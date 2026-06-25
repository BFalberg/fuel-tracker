<?php

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('mileage must exceed the highest existing mileage, not just the most recent by date', function () {
    $user = User::factory()->create();
    $car = Car::factory()->for($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    // First refuel at 1000 km, created first
    Refuel::create([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => 1000,
        'type' => 'fossil',
        'created_at' => now()->subDays(2),
    ]);

    // Second refuel at 1500 km, inserted later
    Refuel::create([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 15,
        'total_price' => 250,
        'mileage' => 1500,
        'type' => 'fossil',
        'created_at' => now()->subDay(),
    ]);

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

test('mileage must exceed highest existing mileage on update', function () {
    $user = User::factory()->create();
    $car = Car::factory()->for($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    $first = Refuel::create([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => 1000,
        'type' => 'fossil',
    ]);

    Refuel::create([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 15,
        'total_price' => 300,
        'mileage' => 2000,
        'type' => 'fossil',
    ]);

    // Updating first refuel to 1500 should fail — second refuel is at 2000
    $this->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->put("/refuels/{$first->id}", [
            '_token' => 'test',
            'car_id' => $car->id,
            'gas_station_id' => $station->id,
            'liters_refueled' => 10,
            'total_price' => 200,
            'mileage' => 1500,
        ])
        ->assertSessionHasErrors('mileage');
});

test('new refuel above highest existing mileage passes', function () {
    $user = User::factory()->create();
    $car = Car::factory()->for($user)->create(['is_electric' => false]);
    $station = GasStation::factory()->create();

    Refuel::create([
        'car_id' => $car->id,
        'gas_station_id' => $station->id,
        'liters_refueled' => 10,
        'total_price' => 200,
        'mileage' => 1000,
        'type' => 'fossil',
    ]);

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
