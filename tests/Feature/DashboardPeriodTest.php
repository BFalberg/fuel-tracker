<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

test('a malformed from parameter is rejected rather than crashing', function () {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get('/dashboard?from=not-a-date')
        ->assertSessionHasErrors('from');
});

test('an array injected as a date parameter is rejected', function () {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get('/dashboard?from[]=2026-01')
        ->assertSessionHasErrors('from');
});

test('a from parameter is honoured and starts at the first of the month', function () {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get('/dashboard?from=2026-02&to=2026-04')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('selectedFrom', '2026-02')
            ->where('selectedTo', '2026-04')
        );
});

test('an absurdly wide period is clamped instead of fanning out queries', function () {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    DB::enableQueryLog();

    $this->actingAs($user)
        ->get('/dashboard?from=1900-01&to=2026-08')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
                ->has('stats.stats.monthlyTrends', 60)
            )
        );

    expect(count(DB::getQueryLog()))->toBeLessThan(50);

    DB::disableQueryLog();
});
