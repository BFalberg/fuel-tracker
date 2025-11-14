<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'user_id',
        'start_milage',
        'purchase_price',
        'sale_price',
    ];

    public function refuels(): HasMany
    {
        return $this->hasMany(Refuel::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function carExpenses(): HasMany
    {
        return $this->hasMany(CarExpense::class);
    }
}
