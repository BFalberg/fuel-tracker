<?php

namespace App\Providers;

use Illuminate\Database\Console\Migrations\FreshCommand;
use Illuminate\Database\Console\Migrations\ResetCommand;
use Illuminate\Database\Console\Migrations\RollbackCommand;
use Illuminate\Database\Console\Seeds\SeedCommand;
use Illuminate\Database\Console\WipeCommand;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // This project is wired to the production database.
        // Commands are prohibited in all environments except testing,
        // so that RefreshDatabase can migrate the in-memory SQLite test DB.
        $prohibit = ! $this->app->environment('testing');
        FreshCommand::prohibit($prohibit);
        ResetCommand::prohibit($prohibit);
        RollbackCommand::prohibit($prohibit);
        WipeCommand::prohibit($prohibit);
        SeedCommand::prohibit($prohibit);
    }
}
