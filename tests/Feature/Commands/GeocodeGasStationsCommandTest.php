<?php

declare(strict_types=1);

use App\Models\GasStation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Sleep;

beforeEach(function (): void {
    Sleep::fake();
});

function fakeGeocodeMatch(string $precision): void
{
    Http::fake(['nominatim.openstreetmap.org/*' => Http::response([
        ['lat' => '56.1296', 'lon' => '10.1626', 'addresstype' => $precision, 'display_name' => 'Somewhere'],
    ])]);
}

it('places only stations that have an address but no coordinates', function (): void {
    fakeGeocodeMatch('place');
    $unplaced = GasStation::factory()->create(['address' => 'Grøndalsvej 136, 8260 Viby J']);
    $unknown = GasStation::factory()->create(['address' => 'Unknown']);
    $placed = GasStation::factory()->create(['latitude' => 55.0, 'longitude' => 9.0]);

    $this->artisan('stations:geocode')
        ->expectsOutputToContain('Placed 1 of 1 stations.')
        ->assertSuccessful();

    expect($unplaced->refresh()->latitude)->toBe('56.1296000')
        ->and($unknown->refresh()->latitude)->toBeNull()
        ->and($placed->refresh()->latitude)->toBe('55.0000000');
});

it('saves nothing on a dry run', function (): void {
    fakeGeocodeMatch('place');
    $station = GasStation::factory()->create();

    $this->artisan('stations:geocode', ['--dry-run' => true])
        ->expectsOutputToContain('Would place 1 of 1 stations.')
        ->assertSuccessful();

    expect($station->refresh()->latitude)->toBeNull();
});

it('leaves a station unplaced when only its street is matched', function (): void {
    fakeGeocodeMatch('road');
    $station = GasStation::factory()->create(['address' => 'Lysholt Allé, 7120 Vejle']);

    $this->artisan('stations:geocode')
        ->expectsOutputToContain('skipped, only matched a road')
        ->expectsOutputToContain('Placed 0 of 1 stations.')
        ->assertSuccessful();

    expect($station->refresh()->latitude)->toBeNull();
});

it('waits a second between lookups to respect the usage policy', function (): void {
    fakeGeocodeMatch('place');
    GasStation::factory()->count(3)->create();

    $this->artisan('stations:geocode')->assertSuccessful();

    Sleep::assertSleptTimes(2);
});

it('reports a station whose address is not found', function (): void {
    Http::fake(['nominatim.openstreetmap.org/*' => Http::response([])]);
    $station = GasStation::factory()->create();

    $this->artisan('stations:geocode')
        ->expectsOutputToContain('not found')
        ->expectsOutputToContain('Placed 0 of 1 stations.')
        ->assertSuccessful();

    expect($station->refresh()->latitude)->toBeNull();
});
