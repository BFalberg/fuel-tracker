<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\RefuelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int $car_id
 * @property-read int|null $gas_station_id
 * @property-read string $type
 * @property-read string $liters_refueled
 * @property-read string $total_price
 * @property-read int $mileage
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read Car $car
 * @property-read GasStation|null $gasStation
 */
#[Fillable([
    'car_id',
    'gas_station_id',
    'liters_refueled',
    'total_price',
    'mileage',
    'type',
])]
final class Refuel extends Model
{
    /** @use HasFactory<RefuelFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Car, $this>
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    /**
     * @return BelongsTo<GasStation, $this>
     */
    public function gasStation(): BelongsTo
    {
        return $this->belongsTo(GasStation::class);
    }

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'liters_refueled' => 'decimal:2',
            'total_price' => 'decimal:2',
            'mileage' => 'integer',
        ];
    }

    /**
     * Limit the query to refuels on cars the given user is a member of,
     * as either owner or co-driver.
     *
     * @param  Builder<Refuel>  $query
     * @return Builder<Refuel>
     */
    #[Scope]
    protected function accessibleBy(Builder $query, User $user): Builder
    {
        return $query->whereHas('car.users', fn (Builder $carUsers) => $carUsers->whereKey($user->id));
    }
}
