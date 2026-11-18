<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('renders the welcome page for guests', function (): void {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('welcome'));
});

it('renders the welcome page for signed-in users', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('welcome'));
});
