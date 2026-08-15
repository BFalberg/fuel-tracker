<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Refuel history is the application's irreplaceable data. Deleting a gas station
 * previously cascaded into `refuels`, so removing a shared station destroyed the
 * refuel records of every user who had ever filled up there.
 *
 * The station reference is now nulled instead — `gas_station_id` is already
 * nullable and the UI renders a null station as "Unknown Station".
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->dropForeign(['gas_station_id']);
            $table->foreign('gas_station_id')
                ->references('id')
                ->on('gas_stations')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->dropForeign(['gas_station_id']);
            $table->foreign('gas_station_id')
                ->references('id')
                ->on('gas_stations')
                ->cascadeOnDelete();
        });
    }
};
