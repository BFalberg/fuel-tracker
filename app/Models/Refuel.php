<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refuel extends Model
{
    protected $fillable = [
        'car_id',
        'gas_station_id',
        'liters_refueled',
        'total_price',
        'mileage'
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function gasStation()
    {
        return $this->belongsTo(GasStation::class);
    }
}
