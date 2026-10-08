<?php

declare(strict_types=1);

use App\Models\User;

test('the settings index redirects to the profile settings', function (): void {
    $this->actingAs(User::factory()->create())
        ->get('/settings')
        ->assertRedirect(route('profile.edit'));
});

test('guests are redirected to login from the settings index', function (): void {
    $this->get('/settings')->assertRedirect(route('login'));
});
