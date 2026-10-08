<?php

declare(strict_types=1);

test('tests run on the in-memory sqlite connection', function (): void {
    expect(config('database.default'))->toBe('sqlite')
        ->and(config('database.connections.sqlite.database'))->toBe(':memory:');
});
