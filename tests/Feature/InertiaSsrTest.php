<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

/**
 * Deployment builds client assets only (`npm run build`) and starts no SSR
 * render server, so Inertia must never dispatch a page to one.
 *
 * This is easy to regress: a committed `bootstrap/ssr/ssr.js` is enough for
 * Inertia's BundleDetector to consider SSR live, and the failed dispatch is
 * swallowed into a silent SPA fallback rather than an error.
 */
test('rendering a page never dispatches to the ssr server', function () {
    Http::fake();

    $this->actingAs(User::factory()->create());

    $this->get('/dashboard')->assertOk();

    Http::assertNothingSent();
});

test('enabling ssr requires a build script that produces the bundle', function () {
    $scripts = json_decode(file_get_contents(base_path('package.json')), true)['scripts'] ?? [];

    expect($scripts)->toHaveKey('build:ssr');
})->skip(fn (): bool => ! config('inertia.ssr.enabled'), 'SSR is disabled.');
