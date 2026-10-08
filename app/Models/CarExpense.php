<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ExpenseType;
use Carbon\CarbonInterface;
use Database\Factories\CarExpenseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int $car_id
 * @property-read ExpenseType $expense_type
 * @property-read string $amount
 * @property-read string|null $description
 * @property-read string|null $vendor
 * @property-read CarbonInterface|null $invoice_date
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read Car $car
 */
final class CarExpense extends Model
{
    /** @use HasFactory<CarExpenseFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Car, $this>
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'integer',
            'car_id' => 'integer',
            'expense_type' => ExpenseType::class,
            'amount' => 'decimal:2',
            'description' => 'string',
            'vendor' => 'string',
            'invoice_date' => 'date:Y-m-d',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
