<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Actions\GeocodeAddress;
use App\Models\GasStation;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Sleep;

#[Signature('stations:geocode {--dry-run : Show the coordinates found without saving them}')]
#[Description('Give stations without coordinates a position looked up from their address')]
final class GeocodeGasStationsCommand extends Command
{
    /**
     * Matches on a house-number address point. A street or area match is the
     * middle of a road or district and could preselect the wrong station, so
     * those stations wait for a visit to place them instead.
     */
    private const array PRECISE_MATCHES = ['place', 'building', 'house'];

    public function handle(GeocodeAddress $geocodeAddress): int
    {
        $stations = GasStation::query()
            ->whereNull('latitude')
            ->where('address', '!=', 'Unknown')
            ->orderBy('id')
            ->get();

        $rows = [];

        foreach ($stations as $index => $station) {
            if ($index > 0) {
                Sleep::for(1)->second();
            }

            $result = $geocodeAddress->handle($station->address);
            $isPrecise = $result !== null && in_array($result['precision'], self::PRECISE_MATCHES, true);

            if ($isPrecise && ! $this->option('dry-run')) {
                $station->update(['latitude' => $result['latitude'], 'longitude' => $result['longitude']]);
            }

            $rows[] = [
                $station->id,
                $station->name,
                match (true) {
                    $result === null => 'not found',
                    $isPrecise => "{$result['latitude']}, {$result['longitude']}",
                    default => "skipped, only matched a {$result['precision']}",
                },
            ];
        }

        $this->table(['ID', 'Station', 'Result'], $rows);

        $found = count(array_filter($rows, fn (array $row): bool => is_numeric(explode(',', $row[2])[0])));
        $this->info(($this->option('dry-run') ? 'Would place' : 'Placed')." {$found} of {$stations->count()} stations.");

        return self::SUCCESS;
    }
}
