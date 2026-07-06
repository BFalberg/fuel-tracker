<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $foreignKeys = collect(Schema::getForeignKeys('cars'))
                ->pluck('name')
                ->toArray();

            if (in_array('cars_user_id_foreign', $foreignKeys)) {
                $table->dropForeign(['user_id']);
            }

            $table->dropColumn('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        });
    }
};
