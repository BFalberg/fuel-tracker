<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'user_id'
    ];

    public function refuels(): HasMany
    {
        return $this->hasMany(Refuel::class);
    }
}
