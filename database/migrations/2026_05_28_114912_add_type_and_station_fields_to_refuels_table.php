<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->string('type')->default('fossil')->after('gas_station_id');
            $table->dropForeign(['gas_station_id']);
            $table->foreignId('gas_station_id')->nullable()->change();
            $table->foreign('gas_station_id')->references('id')->on('gas_stations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropForeign(['gas_station_id']);
            $table->foreignId('gas_station_id')->nullable(false)->change();
            $table->foreign('gas_station_id')->references('id')->on('gas_stations')->onDelete('cascade');
        });
    }
};
