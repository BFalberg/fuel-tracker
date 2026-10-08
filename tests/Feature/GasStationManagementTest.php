<?php

declare(strict_types=1);

use App\Models\GasStation;
use App\Models\User;

test('a gas station can be created', function (): void {
    $this->actingAs(User::factory()->create())
        ->post(route('gas-stations.store'), ['name' => 'Circle K Nørreport', 'address' => 'Nørre Voldgade 1'])
        ->assertRedirect(route('gas-stations.index'))
        ->assertSessionHas('success', 'Gas station created successfully');

    expect(GasStation::query()->sole()->only('name', 'address'))
        ->toBe(['name' => 'Circle K Nørreport', 'address' => 'Nørre Voldgade 1']);
});

test('a gas station can be updated', function (): void {
    $station = GasStation::factory()->create();

    $this->actingAs(User::factory()->create())
        ->put(route('gas-stations.update', $station), ['name' => 'Q8 Valby', 'address' => 'Valby Langgade 2'])
        ->assertRedirect(route('gas-stations.index'))
        ->assertSessionHas('success', 'Gas station updated successfully');

    expect($station->refresh()->only('name', 'address'))
        ->toBe(['name' => 'Q8 Valby', 'address' => 'Valby Langgade 2']);
});

test('a gas station requires a name and an address', function (string $method, Closure $url): void {
    $this->actingAs(User::factory()->create())
        ->{$method}($url(), ['name' => '', 'address' => str_repeat('a', 256)])
        ->assertSessionHasErrors(['name', 'address']);
})->with([
    'create' => ['post', fn (): string => route('gas-stations.store')],
    'update' => ['put', fn (): string => route('gas-stations.update', GasStation::factory()->create())],
]);

test('guests cannot create a gas station', function (): void {
    $this->post(route('gas-stations.store'), ['name' => 'Circle K', 'address' => 'Somewhere'])
        ->assertRedirect(route('login'));

    expect(GasStation::query()->count())->toBe(0);
});
