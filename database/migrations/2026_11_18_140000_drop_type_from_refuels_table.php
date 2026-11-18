<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * `type` only repeated whether the car is electric, so `down()` rebuilds it
 * from the cars without loss.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->dropColumn('type');
        });
    }

    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->string('type')->default('fossil')->after('gas_station_id');
        });

        DB::table('refuels')
            ->whereIn('car_id', DB::table('cars')->where('is_electric', true)->select('id'))
            ->update(['type' => 'charge']);
    }
};
