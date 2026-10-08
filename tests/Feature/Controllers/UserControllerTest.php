<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia;

it('renders the registration page', function (): void {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('user/create'));
});

it('may register a new user', function (): void {
    Event::fake([Registered::class]);

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::query()->where('email', 'test@example.com')->sole();

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard', absolute: false));
    Event::assertDispatched(Registered::class);
});

it('requires a valid email to register', function (): void {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@localhost',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('may delete the account', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('user.destroy'), ['password' => 'password'])
        ->assertSessionHasNoErrors()
        ->assertRedirectToRoute('home');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

it('requires the correct password to delete the account', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->fromRoute('user-profile.edit')
        ->delete(route('user.destroy'), ['password' => 'wrong-password'])
        ->assertSessionHasErrors('password')
        ->assertRedirectToRoute('user-profile.edit');

    expect($user->fresh())->not->toBeNull();
});
