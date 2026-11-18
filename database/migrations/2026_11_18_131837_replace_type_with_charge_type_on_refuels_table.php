<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * `type` only repeated whether the car is electric. `charge_type` records how
 * an EV charge was delivered (home, AC or DC); existing charges stay unknown.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->string('charge_type')->nullable()->after('gas_station_id');
        });

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

        Schema::table('refuels', function (Blueprint $table): void {
            $table->dropColumn('charge_type');
        });
    }
};
