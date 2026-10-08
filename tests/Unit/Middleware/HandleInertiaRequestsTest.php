<?php

declare(strict_types=1);

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;

function requestWithSession(): Request
{
    $request = Request::create('/');
    $request->setLaravelSession(new Store('test', new ArraySessionHandler(120)));

    return $request;
}

it('shares a null user for guests', function (): void {
    $shared = new HandleInertiaRequests()->share(requestWithSession());

    expect($shared['auth'])->toBe(['user' => null]);
});

it('shares the authenticated user', function (): void {
    $user = User::factory()->create();
    $request = requestWithSession();
    $request->setUserResolver(fn (): User => $user);

    $shared = new HandleInertiaRequests()->share($request);

    expect($shared['auth'])->toBe(['user' => $user]);
});

it('shares the success flash message from the session', function (): void {
    $request = requestWithSession();
    $request->session()->put('success', 'Car created successfully');

    $shared = new HandleInertiaRequests()->share($request);

    expect($shared['flash'])->toBe(['success' => 'Car created successfully']);
});

it('splits a quote into message and author', function (): void {
    expect(new HandleInertiaRequests()->splitQuote('Simplicity is the ultimate sophistication. - Leonardo da Vinci'))
        ->toBe(['message' => 'Simplicity is the ultimate sophistication.', 'author' => 'Leonardo da Vinci']);
});

it('keeps a hyphenated author name whole', function (): void {
    expect(new HandleInertiaRequests()->splitQuote('So that we may fear less. - Maria Skłodowska-Curie'))
        ->toBe(['message' => 'So that we may fear less.', 'author' => 'Maria Skłodowska-Curie']);
});

it('returns the whole text as the message when a quote has no author', function (): void {
    expect(new HandleInertiaRequests()->splitQuote('Just a message'))
        ->toBe(['message' => 'Just a message', 'author' => '']);
});
