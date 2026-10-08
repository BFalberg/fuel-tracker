<?php

declare(strict_types=1);

namespace Tests;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    /**
     * Local development points `.env` at the production database. Stop the run
     * before RefreshDatabase can touch it if the in-memory SQLite connection
     * from phpunit.xml is not active (for example, when the config is cached).
     */
    final public function createApplication(): Application
    {
        $app = parent::createApplication();

        $connection = $app->make(Repository::class)->get('database.default');
        $database = $app->make(Repository::class)->get("database.connections.{$connection}.database");

        throw_if($connection !== 'sqlite' || $database !== ':memory:', RuntimeException::class, "Tests must run on in-memory SQLite, but the [{$connection}] connection is active. Run `php artisan config:clear` and check phpunit.xml.");

        return $app;
    }
}
