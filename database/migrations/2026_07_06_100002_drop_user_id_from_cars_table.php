<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table): void {
            $hasForeignKey = collect(Schema::getForeignKeys('cars'))
                ->contains(fn ($fk): bool => in_array('user_id', $fk['columns']));

            if ($hasForeignKey) {
                $table->dropForeign(['user_id']);
            }

            $table->dropColumn('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table): void {
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        });
    }
};
