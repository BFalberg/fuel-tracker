<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('renders the profile settings page', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('user-profile.edit'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('user-profile/edit'));
});

it('redirects the settings index to the profile settings', function (): void {
    $this->actingAs(User::factory()->create())
        ->get('/settings')
        ->assertRedirectToRoute('user-profile.edit');
});

it('redirects guests from the settings index to login', function (): void {
    $this->get('/settings')->assertRedirectToRoute('login');
});

it('may update the profile information', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirectToRoute('user-profile.edit');

    $user->refresh();

    expect($user->name)->toBe('Test User')
        ->and($user->email)->toBe('test@example.com')
        ->and($user->email_verified_at)->toBeNull();
});

it('keeps the email verification when the email is unchanged', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirectToRoute('user-profile.edit');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

it('may not take the email of another user', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update'), [
            'name' => 'Test User',
            'email' => $other->email,
        ])
        ->assertSessionHasErrors('email');
});
