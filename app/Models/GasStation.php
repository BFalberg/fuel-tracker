<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\GasStationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string $address
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class GasStation extends Model
{
    /** @use HasFactory<GasStationFactory> */
    use HasFactory;

    /**
     * @return HasMany<Refuel, $this>
     */
    public function refuels(): HasMany
    {
        return $this->hasMany(Refuel::class);
    }

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'integer',
            'name' => 'string',
            'address' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
