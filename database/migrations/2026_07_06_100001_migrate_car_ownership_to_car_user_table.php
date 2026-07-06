<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('cars')->whereNotNull('user_id')->orderBy('id')->each(function ($car) {
            DB::table('car_user')->insertOrIgnore([
                'car_id' => $car->id,
                'user_id' => $car->user_id,
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }

    public function down(): void
    {
        DB::table('car_user')->delete();
    }
};
