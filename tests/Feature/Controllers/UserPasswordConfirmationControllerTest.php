<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('renders the confirm password page', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('password.confirm'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('user-password-confirmation/create'));
});

it('may confirm the password', function (): void {
    $this->actingAs(User::factory()->create())
        ->post(route('password.confirm.store'), ['password' => 'password'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('dashboard', absolute: false))
        ->assertSessionHas('auth.password_confirmed_at');
});

it('may not confirm an invalid password', function (): void {
    $this->actingAs(User::factory()->create())
        ->post(route('password.confirm.store'), ['password' => 'wrong-password'])
        ->assertSessionHasErrors(['password' => __('auth.password')])
        ->assertSessionMissing('auth.password_confirmed_at');
});
