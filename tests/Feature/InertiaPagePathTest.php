<?php

/**
 * Guards the Inertia page path configuration against casing drift.
 *
 * This project stores pages in `resources/js/pages`, while the package default
 * points at `resources/js/Pages`. A mismatch passes silently on case-insensitive
 * filesystems such as macOS and fails every `assertInertia` component check on
 * case-sensitive CI runners, so the assertions below compare against real
 * directory entries rather than relying on `is_dir()`.
 */
test('configured inertia page paths exist with exact casing', function (string $configKey) {
    $paths = config($configKey);

    expect($paths)->toBeArray()->not->toBeEmpty();

    foreach ($paths as $path) {
        $parent = dirname($path);
        $directory = basename($path);

        expect(is_dir($parent))->toBeTrue("Parent of configured Inertia page path [{$path}] does not exist.");
        expect(scandir($parent))->toContain($directory);
    }
})->with([
    'application' => 'inertia.page_paths',
    'testing' => 'inertia.testing.page_paths',
]);
