<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia;

it('renders the reset password page', function (): void {
    $this->get(route('password.reset', ['token' => 'token', 'email' => 'test@example.com']))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('user-password/create')
            ->where('token', 'token')
            ->where('email', 'test@example.com'));
});

it('may reset the password with a valid token', function (): void {
    $user = User::factory()->create();
    $token = Password::createToken($user);

    $this->post(route('password.store'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirectToRoute('login');

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

it('may not reset the password with an invalid token', function (): void {
    $user = User::factory()->create();

    $this->post(route('password.store'), [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertSessionHasErrors(['email' => __('passwords.token')]);

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
});

it('renders the password settings page', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('password.edit'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('user-password/edit'));
});

it('may update the password', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->fromRoute('password.edit')
        ->put(route('password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirectToRoute('password.edit');

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

it('requires the current password to update the password', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->fromRoute('password.edit')
        ->put(route('password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertSessionHasErrors('current_password')
        ->assertRedirectToRoute('password.edit');
});
