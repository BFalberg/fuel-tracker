<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;

it('renders the welcome page for guests', function (): void {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('welcome'));
});
