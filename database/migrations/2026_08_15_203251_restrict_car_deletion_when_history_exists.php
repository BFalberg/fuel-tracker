<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A car that has any refuels or expenses cannot be deleted. The application
 * enforces this with a friendly error, but the cascade is removed here so the
 * database itself is incapable of destroying a car's history — no present or
 * future code path can bypass the rule.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->foreign('car_id')->references('id')->on('cars')->restrictOnDelete();
        });

        Schema::table('car_expenses', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->foreign('car_id')->references('id')->on('cars')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->foreign('car_id')->references('id')->on('cars')->cascadeOnDelete();
        });

        Schema::table('car_expenses', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->foreign('car_id')->references('id')->on('cars')->cascadeOnDelete();
        });
    }
};
