<?php

namespace App\Models;

use App\Enums\ExpenseType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'expense_type',
        'amount',
        'description',
        'vendor',
        'invoice_date',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'invoice_date' => 'date:Y-m-d',
            'expense_type' => ExpenseType::class,
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
