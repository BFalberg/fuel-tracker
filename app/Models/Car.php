<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\CarFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string $registration_number
 * @property-read bool $is_electric
 * @property-read int|null $start_milage
 * @property-read string|null $purchase_price
 * @property-read string|null $sale_price
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
#[Fillable([
    'name',
    'registration_number',
    'start_milage',
    'purchase_price',
    'sale_price',
    'is_electric',
])]
final class Car extends Model
{
    /** @use HasFactory<CarFactory> */
    use HasFactory;

    /**
     * @return BelongsToMany<User, $this, CarUser>
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->using(CarUser::class)->withPivot('role')->withTimestamps();
    }

    /**
     * @return HasMany<Refuel, $this>
     */
    public function refuels(): HasMany
    {
        return $this->hasMany(Refuel::class);
    }

    /**
     * @return HasMany<CarExpense, $this>
     */
    public function carExpenses(): HasMany
    {
        return $this->hasMany(CarExpense::class);
    }

    /**
     * Whether this car has any recorded history. A car with history can never
     * be deleted — the database enforces this too, via restrictOnDelete.
     */
    public function hasHistory(): bool
    {
        return $this->refuels()->exists() || $this->carExpenses()->exists();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_electric' => 'boolean',
            'start_milage' => 'integer',
            'purchase_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
        ];
    }
}
