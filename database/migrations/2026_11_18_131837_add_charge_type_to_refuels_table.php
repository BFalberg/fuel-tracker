<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `charge_type` records how an EV charge was delivered (home, AC or DC);
 * existing charges stay unknown.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->string('charge_type')->nullable()->after('gas_station_id');
        });
    }

    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->dropColumn('charge_type');
        });
    }
};
