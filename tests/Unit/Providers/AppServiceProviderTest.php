<?php

declare(strict_types=1);

use App\Providers\AppServiceProvider;

afterEach(function (): void {
    $this->app['env'] = 'testing';

    new AppServiceProvider($this->app)->boot();
});

it('prohibits destructive database commands outside the testing environment', function (string $command): void {
    $this->app['env'] = 'production';

    new AppServiceProvider($this->app)->boot();

    $this->artisan($command)
        ->expectsOutputToContain('This command is prohibited from running in this environment.')
        ->assertFailed();
})->with([
    'migrate:fresh',
    'migrate:reset',
    'migrate:rollback',
    'db:wipe',
    'db:seed',
]);
