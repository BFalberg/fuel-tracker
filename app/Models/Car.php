<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'registration_number',
        'start_milage',
        'purchase_price',
        'sale_price',
        'is_electric',
    ];

    protected function casts(): array
    {
        return [
            'is_electric' => 'boolean',
            'start_milage' => 'integer',
            'purchase_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function refuels(): HasMany
    {
        return $this->hasMany(Refuel::class);
    }

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
}
