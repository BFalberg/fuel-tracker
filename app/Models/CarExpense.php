<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarExpense extends Model
{
    protected $fillable = [
        'car_id',
        'expense_type',
        'amount',
        'description',
        'vendor',
        'invoice_date',
    ];

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
