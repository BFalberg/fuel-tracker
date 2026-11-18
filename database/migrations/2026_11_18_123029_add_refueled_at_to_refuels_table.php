<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Until now a refuel's date was its `created_at`, which the user cannot set.
 * Existing rows keep that date; rows without one fall back to the backfill time.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->dateTime('refueled_at')->nullable()->after('mileage');
        });

        DB::table('refuels')->update([
            'refueled_at' => DB::raw('COALESCE(created_at, CURRENT_TIMESTAMP)'),
        ]);

        Schema::table('refuels', function (Blueprint $table): void {
            $table->dateTime('refueled_at')->nullable(false)->change();
            $table->index(['car_id', 'refueled_at']);
        });
    }

    public function down(): void
    {
        Schema::table('refuels', function (Blueprint $table): void {
            $table->dropIndex(['car_id', 'refueled_at']);
            $table->dropColumn('refueled_at');
        });
    }
};
