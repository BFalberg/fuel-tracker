<?php

declare(strict_types=1);

namespace App\Actions;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

final readonly class GeocodeAddress
{
    /**
     * Look up a coordinate for a street address with OpenStreetMap Nominatim.
     * Returns null when nothing is found or the lookup fails. Nominatim's usage
     * policy allows one request per second, which callers must respect.
     *
     * @return array{latitude: float, longitude: float, precision: string, match: string}|null
     */
    public function handle(string $address): ?array
    {
        try {
            $response = Http::withUserAgent('fuel-tracker/1.0 (private logbook)')
                ->timeout(20)
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $address,
                    'format' => 'jsonv2',
                    'limit' => 1,
                    'countrycodes' => 'dk,se,de',
                ]);
        } catch (ConnectionException) {
            return null;
        }

        /** @var list<array{lat?: string, lon?: string, addresstype?: string, display_name?: string}> $results */
        $results = $response->successful() ? (array) $response->json() : [];
        $result = $results[0] ?? null;

        if (! isset($result['lat'], $result['lon'])) {
            return null;
        }

        return [
            'latitude' => round((float) $result['lat'], 7),
            'longitude' => round((float) $result['lon'], 7),
            'precision' => $result['addresstype'] ?? 'unknown',
            'match' => $result['display_name'] ?? '',
        ];
    }
}
