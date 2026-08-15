<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refuel extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'gas_station_id',
        'liters_refueled',
        'total_price',
        'mileage',
        'type',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'liters_refueled' => 'decimal:2',
            'total_price' => 'decimal:2',
            'mileage' => 'integer',
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function gasStation(): BelongsTo
    {
        return $this->belongsTo(GasStation::class);
    }

    /**
     * Limit the query to refuels on cars the given user is a member of,
     * as either owner or co-driver.
     *
     * @param  Builder<Refuel>  $query
     * @return Builder<Refuel>
     */
    public function scopeAccessibleBy(Builder $query, User $user): Builder
    {
        return $query->whereHas('car.users', fn (Builder $carUsers) => $carUsers->whereKey($user->id));
    }
}
