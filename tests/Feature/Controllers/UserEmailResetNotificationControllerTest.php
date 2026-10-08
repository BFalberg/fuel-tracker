<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia;

it('renders the forgot password page', function (): void {
    $this->get(route('password.request'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('user-email-reset-notification/create'));
});

it('sends a reset link to an existing user', function (): void {
    Notification::fake();

    $user = User::factory()->create();

    $this->fromRoute('password.request')
        ->post(route('password.email'), ['email' => $user->email])
        ->assertRedirectToRoute('password.request')
        ->assertSessionHas('status', 'A reset link will be sent if the account exists.');

    Notification::assertSentTo($user, ResetPassword::class);
});

it('gives the same answer for an unknown email', function (): void {
    Notification::fake();

    $this->post(route('password.email'), ['email' => 'nobody@example.com'])
        ->assertSessionHas('status', 'A reset link will be sent if the account exists.');

    Notification::assertNothingSent();
});
