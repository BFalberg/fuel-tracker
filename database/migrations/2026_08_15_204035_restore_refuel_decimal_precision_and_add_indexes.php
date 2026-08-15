<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `2025_02_28_213239_update_columns_for_refuels` called `->decimal('total_price')->change()`
 * with no arguments, which silently reset the column from decimal(10,2) to Laravel's
 * decimal(8,2) default and capped values at 999,999.99. This restores the intended
 * precision and adds the indexes every dashboard aggregate filters on.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->decimal('total_price', 10, 2)->change();
            $table->decimal('liters_refueled', 8, 2)->change();

            $table->index(['car_id', 'created_at']);
            $table->index(['car_id', 'mileage']);
        });

        Schema::table('car_expenses', function (Blueprint $table) {
            $table->index(['car_id', 'invoice_date']);
        });
    }

    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->dropIndex(['car_id', 'created_at']);
            $table->dropIndex(['car_id', 'mileage']);
        });

        Schema::table('car_expenses', function (Blueprint $table) {
            $table->dropIndex(['car_id', 'invoice_date']);
        });
    }
};
