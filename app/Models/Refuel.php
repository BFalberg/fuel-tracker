<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function gasStation()
    {
        return $this->belongsTo(GasStation::class);
    }
}
