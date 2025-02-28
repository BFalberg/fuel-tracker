<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GasStation extends Model
{
    protected $fillable = ['name', 'address'];

    public function refuels(): HasMany
    {
        return $this->hasMany(Refuel::class);
    }
}
