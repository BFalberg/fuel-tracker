<?php

declare(strict_types=1);

use App\Actions\GeocodeAddress;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

it('returns the first match for an address', function (): void {
    Http::fake(['nominatim.openstreetmap.org/*' => Http::response([
        ['lat' => '55.7239581', 'lon' => '9.5871254', 'addresstype' => 'road', 'display_name' => 'Lysholt Allé, Vejle'],
    ])]);

    expect(resolve(GeocodeAddress::class)->handle('Lysholt Allé, 7120 Vejle'))->toBe([
        'latitude' => 55.7239581,
        'longitude' => 9.5871254,
        'precision' => 'road',
        'match' => 'Lysholt Allé, Vejle',
    ]);

    Http::assertSent(fn (Request $request): bool => $request['q'] === 'Lysholt Allé, 7120 Vejle'
        && $request->hasHeader('User-Agent', 'fuel-tracker/1.0 (private logbook)'));
});

it('returns null when nothing is found or the lookup fails', function (int $status, array $body): void {
    Http::fake(['nominatim.openstreetmap.org/*' => Http::response($body, $status)]);

    expect(resolve(GeocodeAddress::class)->handle('Nowhere 1'))->toBeNull();
})->with([
    'no match' => [200, []],
    'server error' => [500, []],
]);

it('returns null when the lookup cannot connect', function (): void {
    Http::fake(['nominatim.openstreetmap.org/*' => Http::failedConnection()]);

    expect(resolve(GeocodeAddress::class)->handle('Nowhere 1'))->toBeNull();
});
