<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Charge types were never filled in, so the empty column is dropped.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->dropColumn('charge_type');
        });
    }

    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->string('charge_type')->nullable()->after('gas_station_id');
        });
    }
};
