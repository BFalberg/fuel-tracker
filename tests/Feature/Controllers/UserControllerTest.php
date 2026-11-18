<?php

declare(strict_types=1);

use App\Models\User;

it('does not offer registration', function (string $method): void {
    $this->{$method}('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();

    expect(User::query()->count())->toBe(0);
})->with(['get', 'post']);

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
